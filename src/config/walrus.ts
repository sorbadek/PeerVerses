import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { WalrusClient } from '@mysten/walrus';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Initialize the Sui client for Walrus to interact with the blockchain
const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'), // Options: 'devnet', 'testnet', 'mainnet'
});

// Initialize the Walrus client
export const walrusClient = new WalrusClient({
  network: 'testnet', // Use 'devnet' or 'mainnet' if needed
  suiClient,
  packageConfig: {
    systemObjectId: '0x98ebc47370603fe81d9e15491b2f1443d619d1dab720d586e429ed233e1255c1',
    stakingPoolId: '0x20266a17b4f1a216727f3eef5772f8d486a9e3b5e319af80a5b75809c035561d',
  },
});

// Storage configuration
export const WALRUS_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'video/mp4',
  ],
  bucketName: 'peerverse-storage',
  fileTypes: {
    IMAGE: 1,
    VIDEO: 2,
    PDF: 3,
    OTHER: 4,
  },
  mimeTypeMap: {
    'image/jpeg': 1,
    'image/png': 1,
    'image/gif': 1,
    'video/mp4': 2,
    'application/pdf': 3,
  },
};

// Example endpoints (backend proxy handlers)
export const STORAGE_ENDPOINTS = {
  upload: '/api/storage/upload',
  download: '/api/storage/download',
  delete: '/api/storage/delete',
};

// Helper to create a unique storage reference for each file
export const generateStorageRef = (userId: string, fileType: string): string => {
  const timestamp = Date.now();
  return `${userId}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileType}`;
};

// Example usage: upload a simple file (must be run within a secure backend or with user consent)
export const uploadExampleBlob = async () => {
  const keypair = Keypair.fromSecretKey(new Uint8Array([
    // Your Sui secret key bytes go here (keep safe!)
  ]));

  const file = new TextEncoder().encode('Hello from the PeerVerses app!');
  
  const { blobId } = await walrusClient.writeBlob({
    blob: file,
    deletable: false,
    epochs: 3,
    signer: keypair,
  });

  console.log('Uploaded Blob ID:', blobId);
  return blobId;
};
