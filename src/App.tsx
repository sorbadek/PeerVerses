import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { networkConfig, NETWORK } from './lib/suiConfig';
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import TutorHub from "./pages/TutorHub";
import Marketplace from "./pages/Marketplace";
import Vault from "./pages/Vault";
import PublicProfile from "./pages/PublicProfile";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider defaultNetwork={NETWORK} networks={networkConfig}>
        <WalletProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Router>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/learn" 
                    element={
                      <ProtectedRoute>
                        <Learn />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tutor-hub" 
                    element={
                      <ProtectedRoute>
                        <TutorHub />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/marketplace" 
                    element={
                      <ProtectedRoute>
                        <Marketplace />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/vault" element={<Vault />} />
                  <Route path="/public-profile" element={<PublicProfile />} />
                  <Route path="/community" element={<Community />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </TooltipProvider>
          </AuthProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default App;
