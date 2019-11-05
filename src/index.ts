import { Provider, Networks, DapiInstance, AccountWithLabel, AccountWithPubKey, GetBalanceArgs, BalanceResults, GetStorageArgs, StorageResponse, InvokeReadArgs, GetBlockInputArgs, BlockDetails, GetBlockHeightInputArgs, BlockHeight, TransactionInputArgs, TransactionDetails, ApplicationLog, SendArgs, SendOutput, InvokeArgs, InvokeOutput, InvokeMultiArgs, SignedMessage, DeployArgs, DeployOutput } from './types';

const config = require('../providers.json');
class NeoUnifiedDapi {
    private _currentApi = null;
    private _dapiInstance: DapiInstance = null;
    
    public getAvailableWalletAPIs = () => {
        const walletAPIs = [];
        for (let apiName in config) {
            const webApi = window[config[apiName]['web']];
            let moduleApi = undefined;
            try {
                moduleApi = require(config[apiName]['module']);
            } catch(e) {}
            const api = webApi || moduleApi;
            if (api) {
                walletAPIs.push({
                    name: apiName,
                    api,
                });
            }
        }
        return walletAPIs;
    }

    /**
     * this function should be invoked after READY event
     */
    public useAPI = (walletAPI: any): void => {
        switch (walletAPI.name) {
            case 'O3':
                this._dapiInstance = walletAPI.api;
                break;
            case 'NEOLine':
                this._dapiInstance = new walletAPI.api.Init();
                break;
            case 'Teemo':
                this._dapiInstance = walletAPI.api.NEO;
                break;
            default:
                this._dapiInstance = walletAPI.api;
        }
        this._currentApi = walletAPI;
    }

    public getCurrentProvider = async (): Promise<Provider> => {
        return this._dapiInstance.getProvider();
    }

    public getNetworks = async (): Promise<Networks> => {
        return this._dapiInstance.getNetworks();
    }

    public getAccount = async (): Promise<AccountWithLabel> => {
        return this._dapiInstance.getAccount();
    }

    public getPublicKey = async (): Promise<AccountWithPubKey> => {
        return this._dapiInstance.getPublicKey();
    }

    public getBalance = async (args: GetBalanceArgs): Promise<BalanceResults> => {
        return this._dapiInstance.getBalance(args);
    }

    public getStorage = async (args: GetStorageArgs): Promise<StorageResponse> => {
        return this._dapiInstance.getStorage(args);
    }

    public invokeRead = async (args: InvokeReadArgs): Promise<Object> => {
        return this._dapiInstance.invokeRead(args);
    }

    public getBlock = async (args: GetBlockInputArgs): Promise<{result: BlockDetails}> => {
        return this._dapiInstance.getBlock(args);
    }

    public getBlockHeight = (args: GetBlockHeightInputArgs): Promise<{result: BlockHeight}> => {
        return this._dapiInstance.getBlockHeight(args);
    }

    public getTransaction = (args: TransactionInputArgs): Promise<{result: TransactionDetails}> => {
        return this._dapiInstance.getTransaction(args);
    }

    public getApplicationLog = (args: TransactionInputArgs): Promise<{result: ApplicationLog}> => {
        return this._dapiInstance.getApplicationLog(args);
    }

    public send = (args: SendArgs): Promise<SendOutput> => {
        return this._dapiInstance.send(args);
    }

    public invoke = (args: InvokeArgs): Promise<InvokeOutput> => {
        return this._dapiInstance.invoke(args);
    }

    public invokeMulti = (args: InvokeMultiArgs): Promise<InvokeOutput> => {
        return this._dapiInstance.invokeMulti(args);
    }

    public signMessage = (args: {message: string}): Promise<SignedMessage> => {
        return this._dapiInstance.signMessage(args);
    }

    public deploy = (args: DeployArgs): Promise<DeployOutput> => {
        return this._dapiInstance.deploy(args);
    }
}

const neoUnifiedDapi: NeoUnifiedDapi = new NeoUnifiedDapi();
window['neoUnifiedDapi'] = neoUnifiedDapi;
export default neoUnifiedDapi;

