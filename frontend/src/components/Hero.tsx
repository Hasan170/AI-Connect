import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-background flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-navbar rounded-full"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-footer rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-navbar to-footer bg-clip-text text-transparent">
            Learn Smarter, 
            <br />
            Achieve More
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-text-primary">
            Experience personalized learning with expert tutors who understand your unique needs
          </p>
          <p className="text-lg mb-12 text-text-secondary">
            Join thousands of students who have transformed their academic journey with AI Connect
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/book-class"
              className="group bg-navbar text-white px-8 py-4 rounded-lg hover:bg-footer transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Learning Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/how-it-works"
              className="bg-transparent border-2 border-navbar text-navbar px-8 py-4 rounded-lg hover:bg-navbar hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;