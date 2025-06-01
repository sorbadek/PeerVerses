import { walrusClient, WALRUS_CONFIG, generateStorageRef } from '../config/walrus';

export class WalrusStorageService {
    private client: typeof walrusClient;

    constructor() {
        this.client = walrusClient;
    }

    /**
     * Upload a file to Walrus storage
     */
    async uploadFile(file: File, userId: string): Promise<string> {
        try {
            // Validate file
            if (file.size > WALRUS_CONFIG.maxFileSize) {
                throw new Error('File size exceeds maximum allowed size');
            }
            if (!WALRUS_CONFIG.allowedFileTypes.includes(file.type)) {
                throw new Error('File type not allowed');
            }

            // Generate storage reference
            const fileExtension = file.name.split('.').pop() || '';
            const storageRef = generateStorageRef(userId, fileExtension);

            // Upload to Walrus
            const uploadResult = await this.client.files.upload({
                file,
                path: storageRef,
                bucket: WALRUS_CONFIG.bucketName,
            });

            return uploadResult.url;
        } catch (error) {
            console.error('Error uploading file to Walrus:', error);
            throw error;
        }
    }

    /**
     * Download a file from Walrus storage
     */
    async downloadFile(fileUrl: string): Promise<Blob> {
        try {
            const response = await this.client.files.download({
                url: fileUrl,
                bucket: WALRUS_CONFIG.bucketName,
            });

            return response.blob();
        } catch (error) {
            console.error('Error downloading file from Walrus:', error);
            throw error;
        }
    }

    /**
     * Delete a file from Walrus storage
     */
    async deleteFile(fileUrl: string): Promise<void> {
        try {
            await this.client.files.delete({
                url: fileUrl,
                bucket: WALRUS_CONFIG.bucketName,
            });
        } catch (error) {
            console.error('Error deleting file from Walrus:', error);
            throw error;
        }
    }

    /**
     * Get metadata for a file
     */
    async getFileMetadata(fileUrl: string) {
        try {
            const metadata = await this.client.files.metadata({
                url: fileUrl,
                bucket: WALRUS_CONFIG.bucketName,
            });

            return metadata;
        } catch (error) {
            console.error('Error getting file metadata from Walrus:', error);
            throw error;
        }
    }
}
