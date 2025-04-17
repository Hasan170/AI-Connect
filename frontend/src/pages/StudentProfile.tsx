import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Edit, Bell, Book, Calendar, X, CheckCircle, Clock, User, Video } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import StudentSidebar from '../components/StudentSidebar';
import Notebook from '../components/Notebook';
import ScheduleClassModal from '../components/ScheduleClassModal';
import { ClassRequest, ScheduledClass, StudentDetails } from '../types';

interface ProfileData {
  name: string;
  grade: string;
  schoolBoard: string;
  dob: string;
}

interface ClassData {
  id: string;
  subject: string;
  status: 'scheduled' | 'pending' | 'not-scheduled';
  date?: Date;
  time?: string;
  tutor?: string;
  // studentId?: string;
}

const StudentProfile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [enrolledSubjects, setEnrolledSubjects] = useState<string[]>([]);
  const [classRequests, setClassRequests] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    grade: '',
    schoolBoard: '',
    dob: '',
  });
  const [subjects, setSubjects] = useState<string[]>([]);


  // Replace the classesData array with state
  const [classes, setClasses] = useState<ClassData[]>([]);

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

        // Extract enrolled subjects
        const subjects = student.subjects.map((s: any) => s.subject);
        setEnrolledSubjects(subjects);

        setProfileData({
          name: student.name,
          grade: student.grade,
          schoolBoard: student.schoolBoard,
          dob: student.dateOfBirth,
        });

        // Set subjects for display
        setSubjects(subjects);

        // Fetch class requests and scheduled classes
        const requestsRes = await api.get(`/requests/student/${student._id}`);
        const classesRes = await api.get(`/classes/student/${student._id}`);

        // Merge data for display
        const mergedClasses = subjects.map((subject: any) => {
          const scheduled = classesRes.data.find((c: any) => c.subject === subject);
          const request = requestsRes.data.find((r: any) => r.subject === subject);

          return {
            subject,
            status: scheduled ? 'scheduled' : request?.status || 'not-scheduled',
            time: scheduled?.time,
            date: scheduled?.date,
            tutor: scheduled?.teacherId?.name,
            id: scheduled?._id || request?._id
          };
        });

        setProfileData({
          name: student.name,
          grade: student.grade,
          schoolBoard: student.schoolBoard,
          dob: student.dateOfBirth,
        });
        // setSubjects(student.subjects.split(', '));
        setSubjects(student.subjects.map((s: any) => s.subject));
        setClassRequests(mergedClasses);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load student data');
      }
      finally {
        setLoading(false);
      }
    };

    const fetchScheduledClasses = async () => {
      try {
        setLoading(true);
        setError('');
        const email = localStorage.getItem('studentEmail');
        if (!email) return;
  
        // First get student details to get ID
        const studentRes = await api.get(`/student/details/${email}`);
        const studentId = studentRes.data._id;
        
        // Then get scheduled classes
        // const classesRes = await api.get(`/classes/student/${studentId}`);
        const classesRes = await api.get(`/classes/student/${studentId}?status=scheduled`);
        setClasses(classesRes.data.map((cls: { _id: any; subject: any; status: any; date: string | number | Date; time: any; teacherId: { name: any; }; }) => ({
          id: cls._id,
          subject: cls.subject,
          status: cls.status,
          date: new Date(cls.date),
          time: cls.time,
          tutor: cls.teacherId?.name // Assuming populated teacher data
        })));
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchStudentDetails();
    fetchScheduledClasses();
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
  };

  const handleScheduleClass = async (classItem: ClassData, selectedDate: Date) => {
    try {
      const studentRes = await api.get(`/student/details/${localStorage.getItem('studentEmail')}`);
      const studentId = studentRes.data._id;
      
      const studentDetails = await api.get(`/student/details/${localStorage.getItem('studentEmail')}`);
      const subjectData = studentDetails.data.subjects.find((s: any) => s.subject === classItem.subject);
      
      if (!subjectData?.teacherId) {
        throw new Error('No teacher assigned for this subject');
      }
  
      // Convert teacherId to string explicitly
      const teacherId = subjectData.teacherId.toString();
  
      await api.post('/requests/class', {
        studentId,
        subject: classItem.subject,
        requestedDate: selectedDate.toISOString(),
        teacherId // Now sending as string
      });
  
      // Update UI state
      setClassRequests(prev => prev.map(cls => 
        cls.subject === classItem.subject 
          ? { ...cls, status: 'pending' }
          : cls
      ));
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
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
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <span
                        key={subject}
                        className="bg-card px-3 py-1 rounded-full text-sm text-text-primary transform hover:scale-105 transition-all duration-300"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No subjects enrolled</p>
                  )}
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
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navbar"></div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {classRequests.map((classItem) => (
                <div key={classItem.subject} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {classItem.subject || 'No Subject'}
                    </h3>
              {/* {classRequests.map((classItem, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">{classItem.subject}</h3> */}
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
                        to={`/class/${classItem.id}`}
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
                ) : (classItem.status === 'pending' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Clock size={16} />
                      <p className="text-sm">Request Pending Approval</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">No class scheduled</p>
                      {/* <button
                        onClick={() => handleScheduleClass(classItem, new Date())}
                        className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.02]"
                      >
                        Request Class
                      </button> */}
                      <button
                        onClick={() => {
                          setSelectedClass(classItem);
                          setIsScheduleModalOpen(true);
                        }}
                        className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.02]">
                        Request Class
                      </button>
                  </>
                ))}
              </div>
            ))}
          </div>
            )}

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
        {/* Update both modals at the bottom of the file */}
        <ScheduleClassModal
          isOpen={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setSelectedClass(null);
          }}
          isReschedule={false}
          subject={selectedClass?.subject}
          onSubmit={async (date, time) => {
            if (selectedClass) {
              await handleScheduleClass(selectedClass, date);
            }
          }}
        />

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
            date: selectedClass.date?.toISOString() || '',
            time: selectedClass.time || ''
          } : undefined}
          onSubmit={async (date, time) => {
            // Implement reschedule logic here
          }}
        />

        {isNotebookOpen && <Notebook onClose={() => setIsNotebookOpen(false)} />}
      </div>
    </div>
  );
};

export default StudentProfile;