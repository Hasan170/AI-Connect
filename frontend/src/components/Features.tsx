import React from 'react';
import { BookOpen, Users, Clock, Award, Zap, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Expert Tutors",
      description: "Learn from highly qualified and experienced educators"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "1-on-1 Sessions",
      description: "Personalized attention for maximum learning impact"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexible Timing",
      description: "Schedule classes at your convenience, 24/7"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Learning",
      description: "Structured curriculum and proven teaching methods"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Support",
      description: "Get help whenever you need it"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe Learning",
      description: "Secure and monitored online environment"
    }
  ];

  return (
    <div className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-text-primary">
          Why Choose <span className="text-navbar">AI Connect</span>?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg bg-background hover:bg-navbar group transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-navbar group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-text-primary group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-text-secondary group-hover:text-white/90 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;