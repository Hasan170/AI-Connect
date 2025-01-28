import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

const BookClass = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English Literature', 'History', 'Computer Science'
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM'
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

            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-text-primary">Our Guarantee</h3>
              <p className="text-text-secondary">
                If you're not satisfied with your first class, we'll give you a full refund
                or match you with another tutor at no additional cost.
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Book Your Session</h2>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
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
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Time Slot
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar focus:border-transparent transition-all duration-300"
                  placeholder="Tell us about your learning goals..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="group w-full bg-navbar text-white py-3 rounded-lg hover:bg-footer transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Book Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookClass;