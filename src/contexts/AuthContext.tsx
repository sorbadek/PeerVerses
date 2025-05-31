
import React, { createContext, useState, useEffect } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: { address: string } | null;
  handleZkLogin: () => Promise<void>;
  handleCallback: (idToken: string, address: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ address: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('zkLogin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleZkLogin = async () => {
    // This will be handled by the useZkLogin hook
    setIsAuthenticated(true);
  };

  const handleCallback = async (idToken: string, address: string) => {
    // Store the user's zkLogin address
    setUser({ address });
    setIsAuthenticated(true);
    localStorage.setItem('zkLogin_user', JSON.stringify({ address }));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('zkLogin_user');
    localStorage.removeItem('zkLogin_nonce');
    localStorage.removeItem('zkLogin_epoch');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleZkLogin, handleCallback, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


