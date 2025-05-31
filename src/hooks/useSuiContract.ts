import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useWalletKit } from '@mysten/dapp-kit';
import { useSuiClient } from '@mysten/dapp-kit';
import { CONTRACT_ADDRESS, MODULE_NAME } from '../lib/suiConfig';

export function useSuiContract() {
  const { signAndExecuteTransactionBlock } = useWalletKit();
  const suiClient = useSuiClient();

  const executeContractCall = async (functionName: string, args: any[] = []) => {
    try {
      const tx = new TransactionBlock();
      
      // Create the transaction
      tx.moveCall({
        target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::${functionName}`,
        arguments: args,
      });

      // Sign and execute the transaction
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      return result;
    } catch (error) {
      console.error('Contract call failed:', error);
      throw error;
    }
  };

  const getContractState = async (objectId: string) => {
    try {
      const object = await suiClient.getObject({
        id: objectId,
        options: {
          showContent: true,
        },
      });
      return object;
    } catch (error) {
      console.error('Failed to get contract state:', error);
      throw error;
    }
  };

  return {
    executeContractCall,
    getContractState,
  };
}
