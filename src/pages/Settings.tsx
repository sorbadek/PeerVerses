
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Wallet, Shield, User, Bell, Eye, Upload, X, Coins } from 'lucide-react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useAuth } from '../hooks/useAuth';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { CONTRACT_ADDRESS } from '../lib/suiConfig';

const Settings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const account = useCurrentAccount();
  const { isAuthenticated, logout } = useAuth();
  const suiClient = useSuiClient();
  const [zkLoginAddress, setZkLoginAddress] = useState(account?.address || '');

  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['defi', 'nfts']);
  const [xpBalance, setXpBalance] = useState<number>(0);
  const [reputationScore, setReputationScore] = useState<number>(0);
  const [isVerified, setIsVerified] = useState(false);
  const [lastLogin, setLastLogin] = useState<number>(0);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  const availableInterests = [
    { id: 'defi', label: 'DeFi & Trading' },
    { id: 'nfts', label: 'NFTs & Digital Art' },
    { id: 'gaming', label: 'Blockchain Gaming' },
    { id: 'development', label: 'Smart Contract Development' },
    { id: 'dao', label: 'DAO & Governance' },
    { id: 'infrastructure', label: 'Blockchain Infrastructure' },
    { id: 'security', label: 'Security & Auditing' },
    { id: 'tokenomics', label: 'Tokenomics & Economics' }
  ];

  const fetchUserProfile = React.useCallback(async () => {
    if (!account?.address) return;

    try {
      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${CONTRACT_ADDRESS}::auth::get_user_profile`,
        arguments: [
          tx.object('REGISTRY_OBJECT_ID'),
          tx.pure(String(account.address))
        ]
      });

      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx.serialize(),
        sender: account.address
      });

      if (result.effects?.status?.status === 'success') {
        const values = (result.results?.[0]?.returnValues || []) as Array<[number[], string] | string | number | boolean>;
        if (values.length >= 5) {
          setUserName(values[0] as string);
          setXpBalance(Number(values[1]));
          setReputationScore(Number(values[2]));
          setIsVerified(Boolean(values[3]));
          setLastLogin(Number(values[4]));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      });
    }
  }, [account?.address, suiClient]);

  useEffect(() => {
    if (account?.address && isAuthenticated) {
      setZkLoginAddress(account.address);
      fetchUserProfile();
    }
  }, [account?.address, isAuthenticated, fetchUserProfile]);

  const handleSaveSettings = async () => {
    if (!account?.address || !isAuthenticated) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Update profile settings
      toast({
        title: 'Settings saved',
        description: 'Your profile and preferences have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    }
  };

  const handleDisconnectZkLogin = async () => {
    try {
      await logout();
      toast({
        title: 'Disconnected',
        description: 'Your zkLogin session has been disconnected.',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect',
        variant: 'destructive'
      });
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 mt-2">Manage your profile and Sui blockchain preferences</p>
            </div>

            {/* Profile Stats */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Coins className="h-5 w-5" />
                  Profile Stats
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your current XP and reputation on the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">XP Balance</Label>
                    <p className="text-xl font-bold text-white">{xpBalance}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Reputation Score</Label>
                    <p className="text-xl font-bold text-white">{reputationScore}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Verified Status</Label>
                    <p className="text-xl font-bold text-white">{isVerified ? 'Verified' : 'Unverified'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Last Login</Label>
                    <p className="text-xl font-bold text-white">
                      {lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Settings */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize your profile information and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="space-y-2">
                  <Label className="text-white">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profilePicture} />
                      <AvatarFallback className="text-lg">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Label htmlFor="profile-upload" className="cursor-pointer">
                        <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </span>
                        </Button>
                      </Label>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureUpload}
                      />
                      {profilePicture && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setProfilePicture('')}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="display-name" className="text-white">Display Name</Label>
                  <Input
                    id="display-name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your display name"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label className="text-white">Learning Interests</Label>
                  <p className="text-sm text-gray-400">
                    Select topics you're interested in to get personalized content recommendations
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {availableInterests.map((interest) => (
                      <div key={interest.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={interest.id}
                          checked={selectedInterests.includes(interest.id)}
                          onChange={() => handleInterestToggle(interest.id)}
                          className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor={interest.id} className="text-sm text-white cursor-pointer">
                          {interest.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* zkLogin & Sui Network Settings */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wallet className="h-5 w-5" />
                  zkLogin & Sui Network
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your zkLogin authentication and Sui blockchain preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zklogin" className="text-white">Connected zkLogin Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="zklogin"
                      value={zkLoginAddress}
                      readOnly
                      className="font-mono text-sm bg-gray-800 border-gray-700 text-white"
                    />
                    <Button variant="outline" onClick={handleDisconnectZkLogin} className="border-gray-700 text-white hover:bg-gray-800">
                      Disconnect
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    zkLogin provides privacy-preserving authentication using zero-knowledge proofs
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network" className="text-white">Sui Network</Label>
                  <Select defaultValue="mainnet">
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="mainnet" className="text-white hover:bg-gray-700">Sui Mainnet</SelectItem>
                      <SelectItem value="testnet" className="text-white hover:bg-gray-700">Sui Testnet</SelectItem>
                      <SelectItem value="devnet" className="text-white hover:bg-gray-700">Sui Devnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Token & Rewards Settings */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Eye className="h-5 w-5" />
                  Rewards & Learning
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure how you want to handle your earned tokens and learning rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile" className="text-white">Public Profile</Label>
                    <p className="text-sm text-gray-400">
                      Allow others to view your achievements and learning progress
                    </p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={publicProfile}
                    onCheckedChange={setPublicProfile}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Control your privacy settings and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="privacy-mode" className="text-white">Privacy Mode</Label>
                    <p className="text-sm text-gray-400">
                      Hide your wallet transactions and learning progress from public view
                    </p>
                  </div>
                  <Switch
                    id="privacy-mode"
                    checked={privacyMode}
                    onCheckedChange={setPrivacyMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile" className="text-white">Public Profile</Label>
                    <p className="text-sm text-gray-400">
                      Allow others to view your achievements and learning progress
                    </p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={publicProfile}
                    onCheckedChange={setPublicProfile}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-white">Push Notifications</Label>
                    <p className="text-sm text-gray-400">
                      Receive notifications about learning milestones and rewards
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="rewards-notif" className="rounded" defaultChecked />
                    <Label htmlFor="rewards-notif" className="text-sm text-white">
                      SUI token rewards and staking updates
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="course-notif" className="rounded" defaultChecked />
                    <Label htmlFor="course-notif" className="text-sm text-white">
                      Course completions and achievements
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="community-notif" className="rounded" />
                    <Label htmlFor="community-notif" className="text-sm text-white">
                      Community updates and events
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-6">
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
