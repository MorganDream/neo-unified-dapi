
export enum DAPI {
    O3 = 'O3',
    NEOLine = 'NEOLine',
}

export enum Event {
    READY = 'READY',
    ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
    NETWORK_CHANGED = 'NETWORK_CHANGED',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    BLOCK_HEIGHT_CHANGED = 'BLOCK_HEIGHT_CHANGED',
    TRANSACTION_CONFIRMED = 'TRANSACTION_CONFIRMED'
}

export interface DapiInstance {
    getProvider: () => Promise<Provider>;
    getNetworks: () => Promise<Networks>;
    getAccount: () => Promise<AccountWithLabel>;
    getPublicKey: () => Promise<AccountWithPubKey>;
    getBalance: (args: GetBalanceArgs) => Promise<BalanceResults>;
    getStorage: (args: GetStorageArgs) => Promise<StorageResponse>;
    invokeRead: (args: InvokeReadArgs) => Promise<Object>;
    getBlock: (args: GetBlockInputArgs) => Promise<{result: BlockDetails}>;
    getBlockHeight: (args: GetBlockHeightInputArgs) => Promise<{result: BlockHeight}>;
    getTransaction: (args: TransactionInputArgs) => Promise<{result: TransactionDetails}>;
    getApplicationLog: (args: TransactionInputArgs) => Promise<{result: ApplicationLog}>;

    send: (args: SendArgs) => Promise<SendOutput>;
    invoke: (args: InvokeArgs) => Promise<InvokeOutput>;
    invokeMulti: (args: InvokeMultiArgs) => Promise<InvokeOutput>;
    signMessage: ({message: string}) => Promise<SignedMessage>;
    deploy: (args: DeployArgs) => Promise<DeployOutput>;
    addEventListener: (event: string, callback: Function) => void;
    removeEventListener: (event: string) => void;
}

export interface Provider {
    name: DAPI;
    website: string;
    version: string;
    compatibility: string[];
    extra: object;
}

export interface Networks {
    networks: string[]; // Array of network names the wallet provider has available for the dapp developer to connect to.
    defaultNetwork: string; // Network the wallet is currently set to.
}

export interface AccountWithLabel {
    address: string; // Address of the connected account, Base58 string format
    label?: string; // A label the users has set to identify their wallet
}

export interface AccountWithPubKey {
    address: string; // Address of the connected account, Base58 string format
    publicKey: string; // Public key of the connected account, in hexstring format
}

export interface GetBalanceArgs {
  params: BalanceRequest|BalanceRequest[];
  network?: string; // Network to submit this request to. If omitted, it will default to the network the wallet is currently set to.
}

export interface BalanceRequest {
  address: string; // Address to check balance(s)
  assets?: string[]; // Asset IDs or script hashes to check balance.
  fetchUTXO?: boolean; // Fetches to UTXO data for NEO and/or GAS if attribute is 'true'
}

export interface BalanceResults {
  [address: string]: Balance[];
}

export interface Balance {
  assetID: string;
  symbol: string;
  amount: string;
}

export interface GetStorageArgs {
    scriptHash: string; // script hash of the smart contract to invoke a read on, in hexstring format
    key: string; // key of the storage value to retrieve from the contract
    network?: string; // Network to submit this request to. If omitted, it will default to the network the wallet is currently set to.
}

export interface StorageResponse {
    result: string; // The raw value that's stored in the contract
}

export interface InvokeReadArgs {
  scriptHash: string; // script hash of the smart contract to invoke a read on
  operation: string; // operation on the smart contract to call
  args: Argument[]; // any input arguments for the operation
  network?: string; // Network to submit this request to. If omitted, it will default to the network the wallet is currently set to.
}

interface Argument {
  type: ArgumentDataType;
  value: any;
}

type ArgumentDataType = 'String'|'Boolean'|'Hash160'|'Hash256'|'Integer'|'ByteArray'|'Array'|'Address';

export interface GetBlockInputArgs {
    blockHeight: number;
    network?: string;
}

export interface BlockDetails {
    hash: string; // Block hash
    size: number; // Block size (bytes)
    version: number; // The version number of the block execution
    previousblockhash: string; // Previous block Hash
    merkleroot: string; // Merkel root
    time: number; // Block generation timestamp
    index: number; // Block index (height)
    nonce: string; // Block pseudo-random number
    nextconsensus: string; // Next master biller
    script: ScriptDetails; // Block call signature authentication information
    tx: BlockTransactionDetails[]; // Block containing trading group
    confirmations: number; // Confirmation number (number of blocks after this block)
    nextblockhash: string; // Next block hash
}
  
interface BlockTransactionDetails {
    txid: string;
    size: number;
    type: string;
    version: number;
    attributes: any[];
    vin: any[];
    vout: any[];
    sys_fee: string;
    net_fee: string;
    scripts: any[];
    nonce: number;
}
  
interface ScriptDetails {
    invocation: string;
    verification: string;
}

export interface GetBlockHeightInputArgs {
    network?: string;
}

export interface BlockHeight {
    result: number; // Block height
}

export interface TransactionInputArgs {
    txid: string;
    network?: string;
}

export interface TransactionDetails {
    txid: string;
    size: number;
    type: string;
    version: number;
    attributes: TransactionAttribute[];
    vin: any[];
    vout: any[];
    sys_fee: string;
    net_fee: string;
    scripts: TransactionScript[];
    script: string;
    gas: string;
    blockhash: string;
    confirmations: number;
    blocktime: number;
  }
  
interface TransactionAttribute {
    usage: string;
    data: string;
}
  
interface TransactionScript {
    invocation: string;
    verification: string;
}

export interface ApplicationLog {
  txid: string;
  executions: ExecutionDetails[];
}

interface ExecutionDetails {
  trigger: string;
  contract: string; // Transaction execution Script Hash
  vmstate: string;
  gas_consumed: string;
  stack: Argument[];
  notifications: Notification[];
}

interface Notification {
  contract: string; // Contract Hash where the transaction execution notice is located
  state: {
    type: 'Array';
    value: Argument[];
  };
}

export interface SendArgs {
    fromAddress: string; // Address of the connected account to send the assets from
    toAddress: string; // Address of the receiver of the assets to be sent
    asset: string; // Asset script hash to be sent
    amount: string; // The parsed amount of the asset to be sent
    remark?: string; // (Optional) Description of the transaction to be made
    fee?: string; // (Optional) The parsed amount of network fee (in GAS) to include with transaction
    network?: string; //  Network to submit this request to. If omitted, it will default to the network the wallet is currently set to.
    broadcastOverride?: boolean; // In the case that the dApp would like to be responsible for broadcasting the signed transaction rather than the wallet provider
}

export interface SendOutput {
    txid: string; // The transaction ID of the send invocation
    nodeUrl?: string; // The node which the transaction was broadcast to. Returned if the transaction is broadcast by a wallet provider
    signedTx?: string; // The serialized signed transaction. Only returned if the broadcastOverride input argument was set to True
}

export interface InvokeArgs {
    scriptHash: string; // script hash of the smart contract to invoke
    operation: string; // operation on the smart contract to call
    args: Argument[]; // any input arguments for the operation
    fee?: string; // (Optional) The parsed amount of network fee (in GAS) to include with transaction
    network?: string; // Network to submit this request to. If omitted, it will default to the network the wallet is currently set to.
    attachedAssets?: AttachedAssets;
    broadcastOverride?: boolean; // In the case that the dApp would like to be responsible for broadcasting the signed transaction rather than the wallet provider
  
    assetIntentOverrides?: AssetIntentOverrides;
    // A hard override of all transaction utxo inputs and outputs.
    // IMPORTANT: If provided, fee and attachedAssets will be ignored.
  
    triggerContractVerification?: boolean; // Adds the instruction to invoke the contract verification trigger
  
    txHashAttributes?: TxHashAttribute[]; // Adds transaction attributes for the "Hash<x>" usage block
}

interface TxHashAttribute extends Argument {
  txAttrUsage: 'Hash1'|'Hash2'|'Hash3'|'Hash4'|'Hash5'|'Hash6'|'Hash7'|'Hash8'|'Hash9'|'Hash10'|'Hash11'|'Hash12'|'Hash13'|'Hash14'|'Hash15';
}

type AttachedAssets = {
    [asset in 'NEO' | 'GAS']: string;
};

// KEY: Asset symbol (only NEO or GAS)
// VALUE: Parsed amount to attach

interface AssetIntentOverrides {
  inputs: AssetInput[];
  outputs: AssetOutput[];
}
interface AssetInput {
    txid: string;
    index: number;
}

interface AssetOutput {
  asset: string;
  address: number;
  value: string;
}

export interface InvokeOutput {
    txid: string; // The transaction ID of the invocation
    nodeUrl?: string; // The node which the transaction was broadcast to. Returned if the transaction is broadcast by a wallet provider
    signedTx?: string; // The serialized signed transaction. Only returned if the broadcastOverride input argument was set to True
}

export interface InvokeMultiArgs {
    invokeArgs: InvokeArguments[]; // List of contract invoke inputs
    fee?: string; // (Optional) The parsed amount of network fee (in GAS) to include with transaction
    network?: string; // Network to submit this request to. If omitted, it will default to the network the wallet is currently set to.
    broadcastOverride?: boolean; // In the case that the dApp would like to be responsible for broadcasting the signed transaction rather than the wallet provider
  
    assetIntentOverrides?: AssetIntentOverrides;
    // A hard override of all transaction utxo inputs and outputs.
    // IMPORTANT: If provided, fee and attachedAssets will be ignored.
  
    txHashAttributes?: TxHashAttribute[]; // Adds transaction attributes for the "Hash<x>" usage block
}

interface InvokeArguments {
  scriptHash: string; // script hash of the smart contract to invoke
  operation: string; // operation on the smart contract to call
  args: Argument[]; // any input arguments for the operation
  attachedAssets?: AttachedAssets;
  triggerContractVerification?: boolean; // Adds the instruction to invoke the contract verification trigger
}

export interface SignedMessage {
    publicKey: string; // Public key of account that signed message
    message: string; // Original message signed
    salt: string; // Salt added to original message as prefix, before signing
    data: string; // Signed message
}

export interface DeployArgs {
    name: string;
    version: string;
    author: string;
    email: string;
    description: string;
    needsStorage?: boolean;
    dynamicInvoke?: boolean;
    isPayable?: boolean;
    parameterList: string;
    returnType: string;
    code: string;
    network?: string; // Network to submit this request to. If omitted, will default to network the wallet is currently set to.
    broadcastOverride?: boolean; // In the case that the dApp would like to be responsible for broadcasting the signed transaction rather than the wallet provider
}

export interface DeployOutput {
    txid: string;
    nodeUrl?: string; // The node which the transaction was broadcast to. Returned if transaction is broadcast by wallet provider
    signedTx?: string; // The serialized signed transaction. Only returned if the broadcastOverride input argument was set to True
}