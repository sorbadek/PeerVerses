import { useState } from 'react';
import { WalrusStorageService } from '../services/WalrusStorageService';
import { useAuth } from './useAuth';

const storageService = new WalrusStorageService();

export const useWalrusStorage = () => {
    const { user } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const uploadFile = async (file: File) => {
        if (!user) throw new Error('User not authenticated');
        
        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Upload file and get URL
            const fileUrl = await storageService.uploadFile(file, user.address);

            setUploadProgress(100);
            return fileUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const downloadFile = async (fileUrl: string) => {
        try {
            return await storageService.downloadFile(fileUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    };

    const deleteFile = async (fileUrl: string) => {
        try {
            await storageService.deleteFile(fileUrl);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    };

    const getFileMetadata = async (fileUrl: string) => {
        try {
            return await storageService.getFileMetadata(fileUrl);
        } catch (error) {
            console.error('Error getting file metadata:', error);
            throw error;
        }
    };

    return {
        uploadFile,
        downloadFile,
        deleteFile,
        getFileMetadata,
        isUploading,
        uploadProgress,
    };
};
