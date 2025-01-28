import React from 'react';
import { BookOpen, Users, Calendar, Award, Star, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Choose Your Subject",
      description: "Select from our wide range of subjects and topics that you need help with."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Match with a Tutor",
      description: "Get matched with an expert tutor who specializes in your subject area."
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "Schedule Sessions",
      description: "Book sessions at times that work best for your schedule."
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "Learn and Succeed",
      description: "Attend interactive sessions and achieve your academic goals."
    }
  ];

  const benefits = [
    {
      icon: <Star className="w-8 h-8" />,
      title: "Expert Tutors",
      description: "All our tutors are thoroughly vetted and have extensive teaching experience."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Schedule",
      description: "Book sessions at your convenience, 24/7 availability."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Personalized Learning",
      description: "Get customized attention and learning plans tailored to your needs."
    }
  ];

  return (
    <div className="pt-24 px-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-navbar to-footer bg-clip-text text-transparent">
            How It Works
          </h1>
          <p className="text-xl text-text-primary max-w-3xl mx-auto">
            Your journey to academic excellence starts here
          </p>
        </div>
        
        {/* Steps Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="text-navbar hover:text-footer transition-colors duration-300">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-text-primary">{step.title}</h3>
              <p className="text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white p-12 rounded-lg shadow-xl mb-16 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-3xl font-bold mb-12 text-center text-text-primary">
            Why Choose <span className="text-navbar">AI Connect</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg bg-background hover:bg-navbar group transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-navbar group-hover:text-white transition-colors duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold my-4 text-text-primary group-hover:text-white transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary group-hover:text-white/90 transition-colors duration-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-xl p-12 mb-16 text-center transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-3xl font-bold mb-6 text-text-primary">Ready to Start Learning?</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already experiencing the benefits of
            personalized tutoring with AI Connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-class"
              className="group bg-navbar text-white px-8 py-4 rounded-lg hover:bg-footer transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Book Your First Class
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-navbar text-navbar px-8 py-4 rounded-lg hover:bg-navbar hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;