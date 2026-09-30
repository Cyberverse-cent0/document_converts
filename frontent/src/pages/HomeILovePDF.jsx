import React from 'react';
import SimpleHeader from '../components/Home/SimpleHeader';
import HeroSection from '../components/Home/HeroSection';
import PopularTools from '../components/Home/PopularTools';
import ToolCategories from '../components/Home/ToolCategories';
import TrustIndicators from '../components/Home/TrustIndicators';

const HomeILovePDF = () => {
  return (
    <div className="min-h-screen">
      <SimpleHeader />
      <HeroSection />
      <PopularTools />
      <ToolCategories />
      <TrustIndicators />
    </div>
  );
};

export default HomeILovePDF;