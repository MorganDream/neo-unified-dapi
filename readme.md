# NEO Unified dApi (NUDApi)
Although neo now have a <a href="https://github.com/neo-project/proposals/pull/69">dApp Platform Provider Interface</a> standard, A dApp that uses one dApi wallet cannot invoke another dApi wallet, which is not so convinient for dApp developers.

## Purpose
Neo Unified dApi(NUDApi) is to enable dApp to use one unified interface to invoke all wallets that aggrees to the dApi standard.

- PERFECT: As long as it's a dApi standard wallet, it can be invoked by NUDApi.
    - This is difficult because if all web plugin wallets injects into web same object, they will contradict with each other.
- CONFIGURE: A dApi wallet need to add its configuration in this project to be involved.
    - This is what we should try to accomplish, currently O3, NEOLine and Teemo top level interfaces are not similar.
- CODE-SPECIFIED: If top level interfaces are not similar, we need to specify the difference in code.

## Suggestions Welcomed
Refer to https://github.com/MorganDream/neo-unified-dapi/issues/1

## How to Use
### Prepare
NUDApi is just like a router for dApp to invoke different neo dapi wallet providers. 
If dApp developer plans to include O3, you need to prepare as instructed on https://neodapidocs.o3.network/#installation.
For web plugin wallets NEOLine and Teemo, developer don't have to specify anything.

### Installation
We have not released this, cdn and npm installations would be enabled after release.

### Get available wallet APIs and select api
```ts
const apis = neoUnifiedDapi.getAvailableWalletAPIs();
console.log(apis);

// Choose API, developer could add some UI interface for users to choose
const useApi = neoUnifiedDapi.useAPI(apis[0]);
```

### Invoke dApi
The invocation of dApi is just like what's in https://github.com/neo-project/proposals/pull/69.
Just pay attention: you have to choose api before you execute any invocations.
```ts
neoUnifiedDapi.getAccount().then(accountInfo => {
    console.log(accountInfo)
})
```

### Event Listener
```ts
neoUnifiedDapi.addEventListener(neoUnifiedDapi.Events.READY, () => {
    neoUnifiedDapi.getAccount().then(accountInfo => {
        console.log(accountInfo)
    });
})
```