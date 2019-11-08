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