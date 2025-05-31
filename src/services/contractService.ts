import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';
import { bcs } from '@mysten/sui.js/bcs';
import { CONTRACT_ADDRESS, MODULE_NAME, CURRENT_NETWORK, NETWORK_CONFIG } from '../config/contract';

class ContractService {
    private client: SuiClient;

    constructor() {
        this.client = new SuiClient({ url: NETWORK_CONFIG[CURRENT_NETWORK] });
    }

    async registerUser(proof: Uint8Array, username: string, currentEpoch: number) {
        const tx = new TransactionBlock();
        
        tx.moveCall({
            target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::register_user`,
            arguments: [
                tx.pure(proof),
                tx.pure(username),
                tx.pure(currentEpoch)
            ],
        });

        return tx;
    }

    async authenticateUser(proof: Uint8Array, currentEpoch: number) {
        const tx = new TransactionBlock();
        
        tx.moveCall({
            target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::authenticate_user`,
            arguments: [
                tx.pure(proof),
                tx.pure(currentEpoch)
            ],
        });

        return tx;
    }

    async getUserProfile(userAddress: string) {
        const tx = new TransactionBlock();
        
        tx.moveCall({
            target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_user_profile`,
            arguments: [tx.pure(userAddress)],
        });

        return tx;
    }

    async awardXP(userAddress: string, amount: number, reason: string) {
        const tx = new TransactionBlock();
        
        tx.moveCall({
            target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::award_xp`,
            arguments: [
                tx.pure(userAddress),
                tx.pure(amount),
                tx.pure(reason)
            ],
        });

        return tx;
    }

    async attendClass(userAddress: string) {
        const tx = new TransactionBlock();
        
        tx.moveCall({
            target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::attend_class`,
            arguments: [tx.pure(userAddress)],
        });

        return tx;
    }

    async createContent(contentType: number, title: string, description: string, xpReward: number) {
        const tx = new TransactionBlock();
        
        tx.moveCall({
            target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::create_content`,
            arguments: [
                tx.pure(contentType),
                tx.pure(title),
                tx.pure(description),
                tx.pure(xpReward)
            ],
        });

        return tx;
    }

    async engageWithContent(contentId: string, engagementType: number) {
        const tx = new TransactionBlock();
        
        tx.moveCall({
            target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::engage_with_content`,
            arguments: [
                tx.pure(contentId),
                tx.pure(engagementType)
            ],
        });

        return tx;
    }
}

export const contractService = new ContractService();
