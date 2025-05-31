import { getFullnodeUrl } from '@mysten/sui.js/client';
import { type NetworkConfig } from '@mysten/dapp-kit';

export const NETWORK = 'devnet';
export const MODULE_NAME = 'auth';

// Replace with your deployed package ID
export const CONTRACT_ADDRESS = '0xbe7b2d57ef7154ae217edbf41b6bbc5293457ea15da61338e1ffa9ba5b531343'; 

export const networkConfig: Record<string, NetworkConfig> = {
  [NETWORK]: { url: getFullnodeUrl(NETWORK) },
};
