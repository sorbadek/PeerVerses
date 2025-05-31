import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { contractService } from '../services/contractService';
import { useToast } from '@/hooks/use-toast';

interface ContractContextType {
    userProfile: any | null;
    isLoading: boolean;
    error: string | null;
    registerUser: (email: string, provider: number, providerId: string, username: string) => Promise<void>;
    authenticateUser: (zkLoginProof: any) => Promise<void>;
    awardXP: (amount: number, reason: string) => Promise<void>;
    refreshUserProfile: () => Promise<void>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: React.ReactNode }) {
    const [userProfile, setUserProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const refreshUserProfile = useCallback(async (address?: string) => {
        if (!address) return;
        
        try {
            setIsLoading(true);
            const profile = await contractService.getUserProfile(address);
            setUserProfile(profile);
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to fetch user profile');
            toast({
                title: "Error",
                description: "Failed to fetch user profile",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const registerUser = useCallback(async (
        email: string,
        provider: number,
        providerId: string,
        username: string
    ) => {
        try {
            setIsLoading(true);
            const emailHash = new TextEncoder().encode(email);
            // Get the current user's address from wallet
            const address = 'USER_ADDRESS'; // Replace with actual wallet integration
            
            await contractService.registerUser(
                address,
                emailHash,
                provider,
                providerId,
                username
            );
            
            await refreshUserProfile(address);
            toast({
                title: "Success",
                description: "Successfully registered!",
            });
        } catch (err) {
            console.error('Error registering user:', err);
            setError('Failed to register user');
            toast({
                title: "Error",
                description: "Failed to register user",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [refreshUserProfile, toast]);

    const authenticateUser = useCallback(async (zkLoginProof: any) => {
        try {
            setIsLoading(true);
            const address = 'USER_ADDRESS'; // Replace with actual wallet integration
            await contractService.authenticateUser(address, zkLoginProof);
            await refreshUserProfile(address);
            toast({
                title: "Success",
                description: "Successfully authenticated!",
            });
        } catch (err) {
            console.error('Error authenticating user:', err);
            setError('Failed to authenticate user');
            toast({
                title: "Error",
                description: "Failed to authenticate user",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [refreshUserProfile, toast]);

    const awardXP = useCallback(async (amount: number, reason: string) => {
        try {
            setIsLoading(true);
            const address = 'USER_ADDRESS'; // Replace with actual wallet integration
            await contractService.awardXP(address, amount, reason);
            await refreshUserProfile(address);
            toast({
                title: "Success",
                description: `Successfully awarded ${amount} XP!`,
            });
        } catch (err) {
            console.error('Error awarding XP:', err);
            setError('Failed to award XP');
            toast({
                title: "Error",
                description: "Failed to award XP",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [refreshUserProfile, toast]);

    return (
        <ContractContext.Provider
            value={{
                userProfile,
                isLoading,
                error,
                registerUser,
                authenticateUser,
                awardXP,
                refreshUserProfile,
            }}
        >
            {children}
        </ContractContext.Provider>
    );
}

export function useContract() {
    const context = useContext(ContractContext);
    if (context === undefined) {
        throw new Error('useContract must be used within a ContractProvider');
    }
    return context;
}
