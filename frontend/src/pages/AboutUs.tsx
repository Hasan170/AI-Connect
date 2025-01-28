import React from 'react';
import { Users, Target, Shield, Trophy, Clock, Heart } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Excellence",
      description: "We strive for excellence in every interaction and learning session"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Innovation",
      description: "Embracing technology to enhance the learning experience"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Student Success",
      description: "Your success is our primary goal and driving force"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust",
      description: "Building lasting relationships through reliability and integrity"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Flexibility",
      description: "Adapting to your schedule and learning preferences"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Creating a supportive environment for growth"
    }
  ];

  return (
    <div className="pt-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-navbar to-footer bg-clip-text text-transparent">
            About AI Connect
          </h1>
          <p className="text-xl text-text-primary max-w-3xl mx-auto">
            Empowering students through personalized education and innovative learning solutions
          </p>
        </div>
        
        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-3xl font-bold mb-6 text-text-primary">Our Story</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Founded with a vision to revolutionize education, AI Connect brings together
              the power of artificial intelligence and human expertise to create an
              unparalleled learning experience.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Our platform connects students with expert tutors who understand their
              unique learning needs and help them achieve their academic goals through
              personalized attention and innovative teaching methods.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Team meeting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center text-text-primary">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="p-6 rounded-lg bg-white hover:bg-navbar group transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <div className="text-navbar group-hover:text-white transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mt-4 mb-2 text-text-primary group-hover:text-white transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-text-secondary group-hover:text-white/90 transition-colors duration-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us Section */}
        <div className="bg-white rounded-lg shadow-xl p-12 mb-24 transform hover:scale-[1.01] transition-all duration-300">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-text-primary">Join Our Journey</h2>
            <p className="text-text-secondary mb-8">
              Whether you're a student looking to excel in your studies or a tutor passionate
              about making a difference, we invite you to be part of our growing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-navbar text-white px-8 py-4 rounded-lg hover:bg-footer transition-all duration-300 transform hover:scale-105">
                Start Learning
              </button>
              <button className="bg-transparent border-2 border-navbar text-navbar px-8 py-4 rounded-lg hover:bg-navbar hover:text-white transition-all duration-300 transform hover:scale-105">
                Become a Tutor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;