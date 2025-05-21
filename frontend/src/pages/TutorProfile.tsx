import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Star, Users, Clock, Book, X, LogOut, MessageSquare, Send, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// Add a Rupee icon component
const RupeeIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 3h12M6 8h12M13 21l-3-13" />
    <path d="M6 13h3c3 0 5-2 5-5" />
  </svg>
);

// Add a Coin icon component
const CoinIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M9.5 9a2.5 2.5 0 0 1 5 0v6" />
    <path d="M9.5 15a2.5 2.5 0 0 0 5 0" />
  </svg>
);

interface ProfileData {
  name: string;
  expertise: string[];
  teachingHours: string;
  rating: number;
}

interface StudentFeedback {
  id: string;
  studentName: string;
  grade: string;
  subject: string;
  feedback?: string;
}

interface FeedbackFormData {
  studentId: string;
  subject: string;
  feedback: string;
  rating?: number;
}

const TutorProfile = () => {
  const navigate = useNavigate();
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); 
  const [selectedStudent, setSelectedStudent] = useState<StudentFeedback | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [studentFeedbacks, setStudentFeedbacks] = useState<StudentFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    expertise: [''],
    teachingHours: '',
    rating: 4.8
  });

  interface ClassData {
    id: string;
    subject: string;
    student: string;
    date: string;
    time: string;
  }
  
  const [classes, setClasses] = useState<ClassData[]>([]);

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
        setTeacherId(teacher._id);
        
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
    
    const fetchClasses = async () => {
      try {
        const email = localStorage.getItem('teacherEmail');
        const teacherRes = await api.get(`/teacher/details/${email}`);
        const classesRes = await api.get(`/classes/teacher/${teacherRes.data._id}?status=scheduled`);
        
        setClasses(classesRes.data.map((cls: { _id: any; subject: any; studentId: { name: any; }; date: string | number | Date; time: any; }) => ({
          id: cls._id,
          subject: cls.subject,
          student: cls.studentId.name,
          date: new Date(cls.date).toLocaleDateString(),
          time: cls.time
        })));
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    const fetchStudentData = async () => {
      try {
        const email = localStorage.getItem('teacherEmail');
        if (!email) return;
        
        const teacherRes = await api.get(`/teacher/details/${email}`);
        const teacherId = teacherRes.data._id;
        setTeacherId(teacherId);
        
        // Fetch students assigned to this teacher
        const studentsRes = await api.get(`/classes/teacher/${teacherId}/students`);
        
        // Transform the data for our component
        const studentData = studentsRes.data.map((student: any) => ({
          id: student._id,
          studentName: student.name,
          grade: student.grade || 'N/A',
          subject: student.subjects.join(', '),
          feedback: student.feedback || undefined
        }));
        
        setStudentFeedbacks(studentData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchTeacherData();
    fetchClasses();
    fetchStudentData();
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // const handleEditSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsEditModalOpen(false);
  // };

  const startClass = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  const handleFeedbackOpen = (student: StudentFeedback) => {
    setSelectedStudent(student);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !teacherId || !feedbackText.trim()) {
      alert("Please enter feedback text");
      return;
    }
    
    try {
      setLoading(true);
      
      // The subject is coming as a comma-separated string - extract first subject
      const firstSubject = selectedStudent.subject.split(', ')[0];
      
      console.log('Submitting tutor feedback:', {
        studentId: selectedStudent.id,
        teacherId,
        subject: firstSubject,
        feedback: feedbackText,
        feedbackType: 'tutorToStudent'
      });
      
      await api.post('/feedback/submit', {
        studentId: selectedStudent.id,
        teacherId,
        subject: firstSubject, // Use first subject if multiple
        feedback: feedbackText,
        feedbackType: 'tutorToStudent'
      });
      
      // Update local state
      setStudentFeedbacks(prev => 
        prev.map(student => 
          student.id === selectedStudent.id 
            ? { ...student, feedback: feedbackText }
            : student
        )
      );
      
      setIsFeedbackModalOpen(false);
      setFeedbackText('');
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('teacherEmail');
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('currentUser');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="py-6 px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header with Logout Button */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300 z-10 relative">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Welcome back, {profileData.name}!</h1>
                {/* <p className="text-text-secondary mt-2">
                  Your next class starts in <span className="font-bold text-navbar">{formatTime(timeLeft)}</span>
                </p> */}
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Profile and Earnings Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-text-primary">Profile</h2>
                {/* <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-navbar hover:text-button-secondary transition-colors"
                > */}
                  {/* <Edit size={20} />
                </button> */}
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
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="font-medium">{profileData.rating}/5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Overview - MODIFIED SECTION */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Earnings Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Changed CoinIcon to CreditCard */}
                <div className="p-4 bg-background rounded-lg transform hover:scale-[1.05] transition-all duration-300">
                  <CreditCard className="text-navbar mb-2" size={24} />
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-xl font-semibold text-text-primary">₹7,200</p>
                </div>
                {/* Changed RupeeIcon to CreditCard */}
                <div className="p-4 bg-background rounded-lg transform hover:scale-[1.05] transition-all duration-300">
                  <CreditCard className="text-navbar mb-2" size={24} />
                  <p className="text-sm text-gray-500">Pending Payout</p>
                  <p className="text-xl font-semibold text-text-primary">₹800</p>
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
              {classes.map((class_) => (
              <div key={class_.id} className="p-4 bg-background rounded-lg transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{class_.subject}</p>
                      <p className="text-sm text-gray-500">{class_.time}</p>
                    </div>
                    <Book className="text-navbar" size={20} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Student: {class_.student}</p>
                    <div className="flex gap-2">
                    <button 
                      className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.05]"
                      onClick={() => startClass(class_.id)}
                    >
                      Start Class
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedbacks Section (Previously Student Insights) */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 transform hover:scale-[1.01] transition-all duration-300">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Student Feedbacks</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {studentFeedbacks.length > 0 ? studentFeedbacks.map((student, index) => (
                <div key={student.id} className="p-4 bg-background rounded-lg transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{student.studentName}</p>
                      <p className="text-sm text-gray-500">Grade: {student.grade}</p>
                      <p className="text-sm text-gray-500">Subject: {student.subject}</p>
                    </div>
                    <MessageSquare className="text-navbar" size={20} />
                  </div>
                  
                  {student.feedback ? (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Your feedback:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
                        {student.feedback}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">No feedback sent yet</p>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.05]"
                      onClick={() => handleFeedbackOpen(student)}
                    >
                      {student.feedback ? 'Edit Feedback' : 'Send Feedback'}
                    </button>
                  </div>
                </div>
              )) : (
                <div className="md:col-span-3 p-8 text-center">
                  <MessageSquare className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-gray-500">No students assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Send Feedback Modal */}
      {isFeedbackModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 transform scale-100 transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Send Feedback</h3>
              <button 
                onClick={() => {
                  setIsFeedbackModalOpen(false);
                  setFeedbackText('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <p className="text-gray-700">{selectedStudent.studentName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <p className="text-gray-700">{selectedStudent.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                  rows={4}
                  placeholder="Provide your feedback about this student's performance..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading || !feedbackText.trim()}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg ${
                  loading || !feedbackText.trim() 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-navbar text-white hover:bg-button-secondary'
                } transition-colors`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorProfile;