import React, { useState } from 'react';
import api from '../api';
import { BookOpen, Users, DollarSign, Award, Star, ArrowRight } from 'lucide-react';

const BecomeTutor = () => {

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    qualification: '',
    bio: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Competitive Pay",
      description: "Earn attractive compensation for your expertise"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Flexible Hours",
      description: "Choose your own schedule and work at your convenience"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Growth Opportunity",
      description: "Develop your teaching skills and expand your reach"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Recognition",
      description: "Get rated and reviewed by students"
    }
  ];

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await api.post('/requests/teacher', {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      expertise: formData.expertise,
      experience: Number(formData.experience),
      qualification: formData.qualification,
      bio: formData.bio
    });
    alert('Application submitted successfully!');
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      expertise: '',
      experience: '',
      qualification: '',
      bio: ''
    });
  } catch (error: any) { // Use TypeScript type assertion if needed
    console.error('Submission error:', error);
    
    // Improved error handling
    const errorMessage = error.response?.data?.message 
      || error.message 
      || "Submission failed. Please try again.";

    alert(errorMessage);
  }
};

  return (
    <div className="pt-24 px-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-navbar to-footer bg-clip-text text-transparent">
            Join Our Teaching Team
          </h1>
          <p className="text-xl text-text-primary max-w-3xl mx-auto">
            Share your knowledge and expertise with students worldwide
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-navbar mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">{benefit.title}</h3>
              <p className="text-text-secondary">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Why Join Us Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 transform hover:scale-[1.02] transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Teaching"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-6 text-text-primary">Why Teach with Us?</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg transform hover:scale-[1.02] transition-all duration-300">
                <Award className="text-navbar" size={24} />
                <p className="text-text-secondary">Join a community of expert educators</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg transform hover:scale-[1.02] transition-all duration-300">
                <Users className="text-navbar" size={24} />
                <p className="text-text-secondary">Connect with motivated students</p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg transform hover:scale-[1.02] transition-all duration-300">
                <Star className="text-navbar" size={24} />
                <p className="text-text-secondary">Build your professional portfolio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-[1.01] transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Application Form</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Full Name
                </label>
                <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                required
              />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Email
                </label>
                <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                required
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Phone Number
                </label>
                <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                required
              />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Subject Expertise
                </label>
                <select 
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                  <option value="computer">Computer Science</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Highest Qualification
                </label>
                <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                required
              />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Tell us about yourself
                </label>
                <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                placeholder="Share your teaching experience and approach..."
                required
              ></textarea>
              </div>
              
              <button
                type="submit"
                className="group w-full bg-navbar text-white py-3 rounded-lg hover:bg-footer transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Submit Application
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeTutor;