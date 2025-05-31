
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LearnContent from '../components/LearnContent';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { contractService } from '../services/contractService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/use-toast';

const Learn = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<{
    xpBalance: number;
    reputationScore: number;
  }>({ xpBalance: 0, reputationScore: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!account?.address || !isAuthenticated) return;

      try {
        const tx = await contractService.getUserProfile(account.address);
        const result = await suiClient.devInspectTransactionBlock({
          transactionBlock: tx.serialize(),
          sender: account.address
        });

        if (result.effects?.status?.status === 'success') {
          const values = (result.results?.[0]?.returnValues || []) as Array<[number[], string] | string | number | boolean>;
          if (values.length >= 5) {
            setUserData({
              xpBalance: Number(values[1]),
              reputationScore: Number(values[2])
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive"
        });
      }
    };

    fetchUserData();
  }, [account?.address, isAuthenticated, suiClient, toast]);

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
            <LearnContent 
              xpBalance={userData.xpBalance}
              reputationScore={userData.reputationScore}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Learn;
