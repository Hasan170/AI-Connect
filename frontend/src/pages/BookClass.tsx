import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../api';

const BookClass = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    grade: '',
    subject: '',
    date: ''
  });

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English Literature', 'History', 'Computer Science'
  ];

  const grades = [
    '6th Grade', '7th Grade', '8th Grade', '9th Grade',
    '10th Grade', '11th Grade', '12th Grade'
  ];

  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-navbar" />,
      title: "Expert Tutors",
      description: "Learn from qualified educators"
    },
    {
      icon: <Clock className="w-6 h-6 text-navbar" />,
      title: "Flexible Timing",
      description: "Choose your preferred schedule"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-navbar" />,
      title: "Guaranteed Quality",
      description: "100% satisfaction guarantee"
    }
  ];

  const steps = [
    {
      icon: <Calendar className="w-6 h-6 text-navbar" />,
      title: "Step 1: Choose Your Class",
      description: "Select the subject and grade you want to book a class for."
    },
    {
      icon: <Clock className="w-6 h-6 text-navbar" />,
      title: "Step 2: Pick a Date",
      description: "Choose a date that fits your schedule."
    },
    {
      icon: <ArrowRight className="w-6 h-6 text-navbar" />,
      title: "Step 3: Book Your Session",
      description: "Fill in your details and book your class."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

// Update the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await api.post('/requests/student', {
      fullName: formData.fullName,
      email: formData.email,
      grade: formData.grade,
      subject: formData.subject,
      preferredDate: formData.date
    });
    
    if (response.status === 201) {
      alert('Request submitted successfully!');
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        grade: '',
        subject: '',
        date: ''
      });
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit request. Please try again.');
  }
};

  return (
    <div className="pt-24 px-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-navbar to-footer bg-clip-text text-transparent">
            Book Your Class
          </h1>
          <p className="text-xl text-text-primary max-w-3xl mx-auto">
            Take the first step towards academic excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Features Section */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-text-primary">Why Choose Us?</h2>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                      <p className="text-text-secondary">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-text-primary">How It Works</h2>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">{step.icon}</div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{step.title}</h3>
                      <p className="text-text-secondary">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Book Your Session</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Grade/Class
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Select your grade</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-navbar text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Book Class
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookClass;