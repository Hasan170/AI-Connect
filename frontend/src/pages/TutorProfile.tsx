import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Star, Users, DollarSign, Clock, Book, X } from 'lucide-react';
import TutorSidebar from '../components/TutorSidebar';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface ProfileData {
  name: string;
  expertise: string[];
  teachingHours: string;
  rating: number;
}

const TutorProfile = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); 
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    expertise: [''],
    teachingHours: '',
    rating: 4.8
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const email = localStorage.getItem('teacherEmail');
        if (!email) {
          navigate('/login');
          return;
        }
  
        const response = await api.get(`/teacher/details/${email}`);
        const teacher = response.data;
        
        setProfileData({
          name: teacher.name,
          expertise: teacher.expertise.split(', '),
          teachingHours: `${teacher.teachingHours}+ hours`,
          rating: teacher.rating,
        });
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        alert('Failed to load profile data');
      }
    };
  
    fetchTeacherData();
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
  };

  return (
    <div className="flex">
      <TutorSidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300">
            <h1 className="text-3xl font-bold text-text-primary">Welcome back, {profileData.name}!</h1>
            <p className="text-text-secondary mt-2">
              Your next class starts in <span className="font-bold text-navbar">{formatTime(timeLeft)}</span>
            </p>
          </div>

          {/* Profile and Earnings Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-text-primary">Profile</h2>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-navbar hover:text-button-secondary transition-colors"
                >
                  <Edit size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-navbar text-white flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{profileData.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expertise</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData.expertise.map((subject) => (
                      <span
                        key={subject}
                        className="bg-card px-3 py-1 rounded-full text-sm text-text-primary transform hover:scale-105 transition-all duration-300"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teaching Hours</p>
                  <p className="font-medium">{profileData.teachingHours}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="font-medium">{profileData.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Overview */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Earnings Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded-lg transform hover:scale-[1.05] transition-all duration-300">
                  <DollarSign className="text-navbar mb-2" size={24} />
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-xl font-semibold text-text-primary">$2,500</p>
                </div>
                <div className="p-4 bg-background rounded-lg transform hover:scale-[1.05] transition-all duration-300">
                  <Clock className="text-navbar mb-2" size={24} />
                  <p className="text-sm text-gray-500">Hours this Month</p>
                  <p className="text-xl font-semibold text-text-primary">45</p>
                </div>
                <div className="p-4 bg-background rounded-lg transform hover:scale-[1.05] transition-all duration-300">
                  <DollarSign className="text-navbar mb-2" size={24} />
                  <p className="text-sm text-gray-500">Pending Payout</p>
                  <p className="text-xl font-semibold text-text-primary">$800</p>
                </div>
              </div>
            </div>
          </div>

          {/* Class Schedule Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-text-primary">Class Schedule</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: '1', time: '10:00 AM', subject: 'Physics', student: 'John Doe', date: '2023-10-01' },
                { id: '2', time: '2:00 PM', subject: 'Mathematics', student: 'Jane Smith', date: '2023-10-01' },
                { id: '3', time: '4:00 PM', subject: 'Physics', student: 'Mike Johnson', date: '2023-10-01' },
              ].map((class_, index) => (
                <div key={index} className="p-4 bg-background rounded-lg transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{class_.subject}</p>
                      <p className="text-sm text-gray-500">{class_.time}</p>
                    </div>
                    <Book className="text-navbar" size={20} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Student: {class_.student}</p>
                  <div className="flex gap-2">
                    <button className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.05]">
                      Start Class
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Insights Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Student Insights</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'John Doe', grade: '10th', progress: 'Excellent' },
                { name: 'Jane Smith', grade: '11th', progress: 'Good' },
                { name: 'Mike Johnson', grade: '12th', progress: 'Needs Improvement' },
              ].map((student, index) => (
                <div key={index} className="p-4 bg-background rounded-lg transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                    </div>
                    <Users className="text-navbar" size={20} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Progress: {student.progress}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.05]">
                      View Report
                    </button>
                    <button className="flex-1 bg-card text-text-primary py-2 rounded-lg hover:bg-gray-300 transition-colors transform hover:scale-[1.05]">
                      Send Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 transform scale-100 transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Hours</label>
                <input
                  type="text"
                  value={profileData.teachingHours}
                  onChange={(e) => setProfileData({...profileData, teachingHours: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={profileData.rating}
                  onChange={(e) => setProfileData({...profileData, rating: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorProfile;