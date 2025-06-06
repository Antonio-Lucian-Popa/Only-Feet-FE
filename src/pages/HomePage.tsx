import React from 'react';
import { useAuth } from '@/context/AuthContext';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCreators from '@/components/home/FeaturedCreators';
import HowItWorks from '@/components/home/HowItWorks';
import PersonalizedFeed from '@/components/home/PersonalizedFeed';

const HomePage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show personalized feed for authenticated users
  if (isAuthenticated) {
    return <PersonalizedFeed />;
  }

  // Show marketing page for non-authenticated users
  return (
    <div>
      <HeroSection />
      <FeaturedCreators />
      <HowItWorks />
    </div>
  );
};

export default HomePage;