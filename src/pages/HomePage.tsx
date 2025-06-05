import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCreators from '@/components/home/FeaturedCreators';
import HowItWorks from '@/components/home/HowItWorks';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedCreators />
      <HowItWorks />
    </div>
  );
};

export default HomePage;