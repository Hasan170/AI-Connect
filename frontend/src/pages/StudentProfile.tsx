import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Edit, Bell, Book, Calendar, X, CheckCircle, Clock, User, Video } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import StudentSidebar from '../components/StudentSidebar';
import Notebook from '../components/Notebook';
import ScheduleClassModal from '../components/ScheduleClassModal';

interface ProfileData {
  name: string;
  grade: string;
  schoolBoard: string;
  dob: string;
}

interface ClassData {
  id?: string;
  subject: string;
  status: 'scheduled' | 'not-scheduled';
  time?: string;
  tutor?: string;
  date?: string;
}

const StudentProfile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    grade: '',
    schoolBoard: '',
    dob: '',
  });

  const [subjects, setSubjects] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const email = localStorage.getItem('studentEmail');
        if (!email) {
          navigate('/login');
          return;
        }

        const response = await api.get(`/student/details/${email}`);
        const student = response.data;

        setProfileData({
          name: student.name,
          grade: student.grade,
          schoolBoard: student.schoolBoard,
          dob: student.dateOfBirth,
        });
        setSubjects(student.subjects.split(', '));
      } catch (error) {
        console.error('Error fetching student details:', error);
        alert('Failed to fetch student details. Please try again.');
      }
    };

    fetchStudentDetails();
  }, [navigate]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Math',
        data: [65, 75, 70, 80, 85],
        borderColor: '#245F73',
        tension: 0.4,
      },
      {
        label: 'Science',
        data: [70, 72, 78, 82, 80],
        borderColor: '#733E24',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    }
  };

  const classesData: ClassData[] = [
    {
      subject: 'Math',
      status: 'scheduled',
      time: 'Today, 10:00 AM',
      tutor: 'Dr. Smith'
    },
    {
      subject: 'Science',
      status: 'not-scheduled'
    },
    {
      subject: 'English',
      status: 'not-scheduled'
    }
  ];

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
  };

  const handleScheduleClass = (classItem: ClassData) => {
    setSelectedClass(classItem);
    setIsScheduleModalOpen(true);
  };

  const handleRescheduleClass = (classItem: ClassData) => {
    setSelectedClass(classItem);
    setIsRescheduleModalOpen(true);
  };

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => setIsNotebookOpen(true)} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300">
            <h1 className="text-3xl font-bold text-text-primary">Welcome back, {profileData.name}!</h1>
            <p className="text-gray-500 mt-2">Let's continue your learning journey</p>
          </div>

          {/* Profile and Progress Section */}
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
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{profileData.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Grade</p>
                  <p className="font-medium">{profileData.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">School Board</p>
                  <p className="font-medium">{profileData.schoolBoard}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{new Date(profileData.dob).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subjects</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {['Math', 'Science', 'English'].map((subject) => (
                      <span
                        key={subject}
                        className="bg-card px-3 py-1 rounded-full text-sm text-text-primary transform hover:scale-105 transition-all duration-300"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Progress Overview</h2>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Enrolled Classes Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {classesData.map((classItem, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">{classItem.subject}</h3>
                  <Book className="text-navbar" size={20} />
                </div>
                {classItem.status === 'scheduled' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={16} />
                      <p className="text-sm">Class Scheduled</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <p className="text-sm">{classItem.time}</p>
                    </div>
                    <p className="text-sm text-gray-600">Tutor: {classItem.tutor}</p>
                    <div className="flex gap-2 mt-4">
                      <Link
                        to="/student/classroom"
                        className="flex-1 bg-navbar text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Video size={16} />
                        Join Class
                      </Link>
                      <button
                        onClick={() => handleRescheduleClass(classItem)}
                        className="flex-1 bg-card text-text-primary py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">No class scheduled</p>
                    <button
                      onClick={() => handleScheduleClass(classItem)}
                      className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.02]"
                    >
                      Request Class
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Notifications Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Notifications</h2>
              <Bell className="text-navbar" size={20} />
            </div>
            <div className="space-y-4">
              {[
                'Math assignment due tomorrow',
                'Science class scheduled for Friday',
                'English test next week',
              ].map((notification, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-background rounded-lg transform hover:scale-[1.01] transition-all duration-300"
                >
                  <Calendar className="text-navbar" size={20} />
                  <p className="text-text-primary">{notification}</p>
                </div>
              ))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input
                    type="text"
                    value={profileData.grade}
                    onChange={(e) => setProfileData({...profileData, grade: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Board</label>
                  <input
                    type="text"
                    value={profileData.schoolBoard}
                    onChange={(e) => setProfileData({...profileData, schoolBoard: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dob}
                    onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.02]"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Schedule Class Modal */}
        <ScheduleClassModal
          isOpen={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setSelectedClass(null);
          }}
          isReschedule={false}
          subject={selectedClass?.subject}
        />

        {/* Reschedule Class Modal */}
        <ScheduleClassModal
          isOpen={isRescheduleModalOpen}
          onClose={() => {
            setIsRescheduleModalOpen(false);
            setSelectedClass(null);
          }}
          isReschedule={true}
          subject={selectedClass?.subject}
          rescheduleData={selectedClass ? {
            id: selectedClass.id || '',
            date: selectedClass.date || '',
            time: selectedClass.time || ''
          } : undefined}
        />

        {isNotebookOpen && <Notebook onClose={() => setIsNotebookOpen(false)} />}
      </div>
    </div>
  );
};

export default StudentProfile;