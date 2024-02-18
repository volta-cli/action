import * as inventoryCache from './cache/inventory';
import * as core from '@actions/core';
import * as stateKeys from './state-keys';

async function run(): Promise<void> {
  const voltaHome = core.getState(stateKeys.VOLTA_HOME);
  await inventoryCache.cacheInventory(voltaHome);
}

run();
