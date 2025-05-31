import { useSuiClient } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { CONTRACT_ADDRESS, MODULE_NAME } from '../lib/suiConfig';
import { useAuth } from './useAuth';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { SuiClient } from '@mysten/sui.js/client';
import { requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });

export const useZkLogin = (): { handleLogin: () => void; handleCallback: (idToken: string) => Promise<void> } => {
  const { handleCallback: authCallback } = useAuth();
  const client = useSuiClient();
  const navigate = useNavigate();

  const handleCallback = async (idToken: string) => {
    console.log('Handling OAuth callback with token:', idToken.substring(0, 10) + '...');
    try {
      // Get stored values
      const epochString = localStorage.getItem('zkLogin_epoch') || '0';
      const nonce = localStorage.getItem('zkLogin_nonce');
      console.log('Handling OAuth callback:', { idToken, nonce });

      if (!nonce) {
        throw new Error('Missing nonce - please try login again');
      }

      const epoch = parseInt(epochString);

      // For testing on devnet, use a test address
      const userAddress = '0x42dd208590e5958a16488cbc771dd324a4a5b0cd34eafaaf28e4ad351d36684f';
      console.log('Using devnet address:', userAddress);

      // Request tokens from faucet
      try {
        console.log('Requesting tokens from faucet...');
        await requestSuiFromFaucetV0({
          host: 'https://faucet.devnet.sui.io',
          recipient: userAddress,
        });
        console.log('Faucet request successful');

        // Wait for tokens to be available
        console.log('Waiting for tokens...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Verify balance
        const { data: coins } = await suiClient.getCoins({
          owner: userAddress,
        });
        console.log('Current balance:', coins.length, 'coins');
      } catch (error) {
        console.error('Faucet request failed:', error);
        // Continue anyway as the address might already have tokens
      }

      try {
        // Create transaction
        const tx = new TransactionBlock();
        
        // Configure transaction
        tx.setSender(userAddress);

        // Get system clock object
        const { data: systemObjects } = await suiClient.getAllCoins({ owner: userAddress });
        const clockId = '0x6'; // System clock object ID

        // Create auth registry if it doesn't exist
        const initTx = new TransactionBlock();
        initTx.setSender(userAddress);

        // Call init_registry to create new registry
        initTx.moveCall({
          target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::init_registry`,
          arguments: []
        });

        try {
          // Build and inspect init transaction
          const builtInitTx = await initTx.build({ client: suiClient });
          const initResult = await suiClient.devInspectTransactionBlock({
            transactionBlock: builtInitTx,
            sender: userAddress
          });
          console.log('Init registry result:', initResult);

          // Get newly created registry
          const { data: registries } = await suiClient.getOwnedObjects({
            owner: userAddress,
            filter: { StructType: `${CONTRACT_ADDRESS}::${MODULE_NAME}::AuthRegistry` },
            options: { showContent: true }
          });
          const registryId = registries[0]?.data?.objectId;

          if (!registryId) {
            throw new Error('Failed to create registry');
          }

          // Add login call with JWT as signature and required objects
          tx.moveCall({
            target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::login_with_zk`,
            arguments: [
              tx.object(registryId),
              tx.pure(idToken), // Using JWT as temporary signature
              tx.pure(epoch),
              tx.object(clockId)
            ]
          });
        } catch (error) {
          console.error('Registry initialization error:', error);
          throw error;
        }

        // Build with client and auto gas
        const builtTx = await tx.build({
          client: suiClient,
          onlyTransactionKind: false
        });

        // Inspect transaction
        const result = await suiClient.devInspectTransactionBlock({
          transactionBlock: builtTx,
          sender: userAddress
        });

        console.log('Transaction inspection:', result);

        // Update auth context and redirect
        await authCallback(idToken, userAddress);
        navigate('/dashboard');
      } catch (error) {
        console.error('Transaction build error:', error);
        navigate('/');
      }

      // Update auth context and redirect
      await authCallback(idToken, userAddress);
      navigate('/dashboard');

    } catch (error) {
      console.error('Callback failed:', error);
      navigate('/');
    }
  };

  const handleLogin = async () => {
    try {
      // Get latest epoch
      const { epoch } = await client.getLatestSuiSystemState();
      localStorage.setItem('zkLogin_epoch', epoch.toString());

      // Generate nonce
      const zkLoginNonce = Math.random().toString(36).substring(2);
      localStorage.setItem('zkLogin_nonce', zkLoginNonce);

      // Get redirect URI
      const redirectUri = `${window.location.origin}/auth/callback`;
      console.log('Redirect URI:', redirectUri);

      // Prepare OAuth URL with proper parameters
      const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      oauthUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
      oauthUrl.searchParams.append('response_type', 'id_token');
      oauthUrl.searchParams.append('redirect_uri', redirectUri);
      oauthUrl.searchParams.append('scope', 'openid email');
      oauthUrl.searchParams.append('nonce', zkLoginNonce);
      oauthUrl.searchParams.append('prompt', 'select_account');

      console.log('OAuth URL:', oauthUrl.toString());

      // Redirect to Google OAuth
      window.location.href = oauthUrl.toString();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return {
    handleCallback,
    handleLogin,
  };
}
