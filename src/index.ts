import { Provider, Networks, DapiInstance, AccountWithLabel, AccountWithPubKey, GetBalanceArgs, BalanceResults, GetStorageArgs, StorageResponse, InvokeReadArgs, GetBlockInputArgs, BlockDetails, GetBlockHeightInputArgs, BlockHeight, TransactionInputArgs, TransactionDetails, ApplicationLog, SendArgs, SendOutput, InvokeArgs, InvokeOutput, InvokeMultiArgs, SignedMessage, DeployArgs, DeployOutput, Event } from './types';

const config = require('../providers.json');
class NeoUnifiedDapi {
    private _currentApi = null;
    private _dapiInstance: DapiInstance = null;
    static Events =  {
        READY: 'READY',
        ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
        NETWORK_CHANGED: 'NETWORK_CHANGED',
        CONNECTED: 'CONNECTED',
        DISCONNECTED: 'DISCONNECTED',
        BLOCK_HEIGHT_CHANGED: 'BLOCK_HEIGHT_CHANGED',
        TRANSACTION_CONFIRMED: 'TRANSACTION_CONFIRMED'
    };
    
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

    public addEventListener = (event: Event, callback: Function) => {
        switch (this._currentApi.name) {
            case 'O3':
                this._dapiInstance.addEventListener(this._dapiInstance[`Constants.EventName.${event}`], callback);
                break;
            case 'NEOLine':
                this._dapiInstance.addEventListener(this._dapiInstance[`EVENT.${event}`], callback);
                break;
            case 'Teemo':
                window.addEventListener(`Teemo.NEO.${event}`, callback as any);
                break;
            default:
                this._dapiInstance.addEventListener(this._dapiInstance[`EVENT.${event}`], callback);
        }
    }

    public removeEventListener = (event: Event, callback?: Function) => {
        switch (this._currentApi.name) {
            case 'O3':
                this._dapiInstance.removeEventListener(this._dapiInstance[`Constants.EventName.${event}`]);
                break;
            case 'NEOLine':
                this._dapiInstance.removeEventListener(this._dapiInstance[`EVENT.${event}`]);
                break;
            case 'Teemo':
                window.removeEventListener(`Teemo.NEO.${event}`, callback as any);
                break;
            default:
                this._dapiInstance.removeEventListener(this._dapiInstance[`EVENT.${event}`]);
        }
    }
}

const neoUnifiedDapi: NeoUnifiedDapi = new NeoUnifiedDapi();
export default neoUnifiedDapi;

