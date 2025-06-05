import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DiscoverPage from '@/pages/DiscoverPage';
import CreatorProfilePage from '@/pages/CreatorProfilePage';
import CreatorDashboardPage from '@/pages/CreatorDashboardPage';
import SubscriptionsPage from '@/pages/SubscriptionsPage';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{element}</> : <>{element}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="creator/:id" element={<CreatorProfilePage />} />
              <Route 
                path="dashboard" 
                element={<ProtectedRoute element={<CreatorDashboardPage />} />} 
              />
              <Route 
                path="subscriptions" 
                element={<ProtectedRoute element={<SubscriptionsPage />} />} 
              />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;