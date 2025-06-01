import { WalrusClient } from '@walrus/sdk';

// Initialize the Walrus client
export const walrusClient = new WalrusClient({
    network: 'mainnet', // or 'testnet' for development
    apiKey: process.env.WALRUS_API_KEY,
    projectId: process.env.WALRUS_PROJECT_ID,
});

// Storage configuration
export const WALRUS_CONFIG = {
    maxFileSize: 50 * 1024 * 1024, // 50MB max file size
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'],
    bucketName: 'peerverse-storage',
    fileTypes: {
        IMAGE: 1,
        VIDEO: 2,
        PDF: 3,
        OTHER: 4
    },
    mimeTypeMap: {
        'image/jpeg': 1,
        'image/png': 1,
        'image/gif': 1,
        'video/mp4': 2,
        'application/pdf': 3
    }
};

// Storage endpoints
export const STORAGE_ENDPOINTS = {
    upload: '/api/storage/upload',
    download: '/api/storage/download',
    delete: '/api/storage/delete',
};

// Helper function to generate storage references
export const generateStorageRef = (userId: string, fileType: string): string => {
    const timestamp = Date.now();
    return `${userId}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileType}`;
};
