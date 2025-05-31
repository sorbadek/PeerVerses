
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { contractService } from '../services/contractService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/use-toast';

interface Props {
  xpBalance: number;
  contributions: number;
}

const XPContributionTracker: React.FC<Props> = ({ xpBalance, contributions }) => {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [monthlyConsumption, setMonthlyConsumption] = useState(0);
  const [netXPChange, setNetXPChange] = useState(0);

  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!account?.address || !isAuthenticated) return;

      try {
        const tx = await contractService.getUserProfile(account.address);
        const result = await suiClient.devInspectTransactionBlock({
          transactionBlock: tx.serialize(),
          sender: account.address
        });

        if (result.effects?.status?.status === 'success' && result.results?.[0]?.returnValues) {
          const values = result.results[0].returnValues as Array<[number[], string] | string | number | boolean>;
          if (values.length >= 5) {
            setMonthlyConsumption(Number(values[3])); // Assuming index 3 contains consumption data
            setNetXPChange(contributions - Number(values[3]));
          }
        }
      } catch (error) {
        console.error('Error fetching user activity:', error);
        toast({
          title: "Error",
          description: "Failed to load activity data",
          variant: "destructive"
        });
      }
    };

    fetchUserActivity();
  }, [account?.address, isAuthenticated, contributions, suiClient, toast]);

  const riskLevel = xpBalance < 500 ? 'high' : xpBalance < 1000 ? 'medium' : 'low';

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Current XP */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <img 
              src="/image/9246f030-df64-4104-a285-57ba9466318c.png" 
              alt="XP Coin" 
              className="w-5 h-5 mr-2"
            />
            <span className="text-gray-400 text-sm">Current XP</span>
          </div>
          <div className="text-2xl font-bold text-white">{xpBalance.toLocaleString()}</div>
          <div className={`text-sm flex items-center justify-center mt-1 ${
            netXPChange >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {netXPChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {netXPChange >= 0 ? '+' : ''}{netXPChange} this month
          </div>
        </div>

        {/* Contributions */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Sessions Hosted</div>
          <div className="text-2xl font-bold text-green-400">{contributions}</div>
          <div className="text-xs text-gray-500 mt-1">this month</div>
        </div>

        {/* Consumption */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Sessions Attended</div>
          <div className="text-2xl font-bold text-blue-400">{monthlyConsumption}</div>
          <div className="text-xs text-gray-500 mt-1">this month</div>
        </div>

        {/* Balance Status */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            {riskLevel === 'high' && <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />}
            <span className="text-gray-400 text-sm">Balance Status</span>
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${
            riskLevel === 'low' ? 'bg-green-900 text-green-300' :
            riskLevel === 'medium' ? 'bg-yellow-900 text-yellow-300' :
            'bg-red-900 text-red-300'
          }`}>
            {riskLevel === 'low' ? 'Healthy' : riskLevel === 'medium' ? 'Watch' : 'Critical'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {riskLevel === 'low' ? 'Keep contributing!' : 
             riskLevel === 'medium' ? 'Host more sessions' : 
             'XP running low'}
          </div>
        </div>
      </div>

      {/* Warning Message for Low XP */}
      {riskLevel === 'high' && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
          <div className="flex items-center text-red-300 text-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="font-medium">XP Critical Level:</span>
          </div>
          <p className="text-red-200 text-sm mt-1">
            Your XP is running low. Host more sessions or contribute solutions to avoid reaching zero XP, 
            which would require purchasing more XP to continue learning.
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
        <p className="text-blue-200 text-sm">
          <span className="font-medium">How it works:</span> Attending sessions consumes XP, hosting sessions earns XP. 
          Keep your contribution-to-consumption ratio balanced to maintain healthy XP levels.
        </p>
      </div>
    </div>
  );
};

export default XPContributionTracker;
