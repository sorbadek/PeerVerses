import { ConnectButton } from '@mysten/dapp-kit';
import { useWalletKit } from '@mysten/dapp-kit';

export function WalletConnect() {
  const { currentAccount } = useWalletKit();

  return (
    <div className="flex items-center gap-4">
      <ConnectButton />
      {currentAccount && (
        <div className="text-sm">
          Connected: {currentAccount.address.slice(0, 6)}...
          {currentAccount.address.slice(-4)}
        </div>
      )}
    </div>
  );
}
