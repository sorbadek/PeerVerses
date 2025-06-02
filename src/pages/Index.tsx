
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import XPBalanceCard from '../components/XPBalanceCard';
import AnalyticsSection from '../components/AnalyticsSection';
import ContinueLearning from '../components/ContinueLearning';
import NotificationPanel from '../components/NotificationPanel';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { CONTRACT_ADDRESS, MODULE_NAME } from '../config/contract'; // Make sure this points to your deployed contract
import { useAuth } from '../hooks/useAuth';
import { useZkLogin } from '../hooks/useZkLogin'; // Import useZkLogin

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<{
    username: string;
    xpBalance: number;
    reputationScore: number;
    isVerified: boolean;
    lastLogin: number;
    contributions: number;
  }>({ 
    username: '', 
    xpBalance: 0, 
    reputationScore: 0, 
    isVerified: false, 
    lastLogin: 0,
    contributions: 0
  });

  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { isAuthenticated } = useAuth();
  const { handleLogin } = useZkLogin(); // Get handleLogin from the hook

  const fetchUserData = React.useCallback(async () => {
    if (!account?.address || !isAuthenticated) return;

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_user_profile`,
        arguments: [tx.pure(account.address)]
      });

      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx.serialize(),
        sender: account.address
      });

      if (result.effects?.status?.status === 'success') {
        const values = (result.results?.[0]?.returnValues || []) as Array<[number[], string] | string | number | boolean>;
        if (values.length >= 5) {
          setUserData({
            username: values[0] as string,
            xpBalance: Number(values[1]),
            reputationScore: Number(values[2]),
            isVerified: Boolean(values[3]),
            lastLogin: Number(values[4]),
            contributions: Number(values[5] || 0)
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [account?.address, isAuthenticated, suiClient]);

  useEffect(() => {
    if (account?.address && isAuthenticated) {
      fetchUserData();
    }
  }, [account?.address, isAuthenticated, fetchUserData]);

  return (
    <div className="min-h-screen bg-black flex w-full">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col w-full lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {!isAuthenticated && (
              <div className="mb-4 flex justify-center">
                <button 
                  onClick={handleLogin} 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Login with Google (zkLogin)
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-4 lg:space-y-6">
                <XPBalanceCard 
                  xpBalance={userData.xpBalance} 
                  contributions={userData.contributions} 
                />
                <AnalyticsSection 
                  reputationScore={userData.reputationScore}
                  isVerified={userData.isVerified}
                />
                <ContinueLearning 
                  username={userData.username}
                  lastLogin={userData.lastLogin}
                />
              </div>
              
              {/* Notifications Panel */}
              <div className="xl:col-span-1">
                <NotificationPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
