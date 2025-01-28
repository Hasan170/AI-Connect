import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Vision from '../components/Vision';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import Stats from '../components/Stats';

const Home = () => {
  // Add smooth scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Stats />
      <Features />
      <Vision />
      <Testimonials />
    </div>
  );
};

export default Home;