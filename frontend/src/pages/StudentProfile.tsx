import React, { useState, useEffect, useRef } from 'react';
import { Edit, Bell, Book, Calendar, X, CheckCircle, Clock, User, Video, Plus, File } from 'lucide-react';
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
}

const StudentProfile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
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
  const [newSubjectRequest, setNewSubjectRequest] = useState({
    subject: '',
    reason: ''
  });

  // Available subjects for selection
  const availableSubjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'English', 'History', 'Geography', 'Computer Science',
    'Economics', 'Political Science', 'Psychology'
  ];

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
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
    fetchScheduledClasses();
  }, [navigate]);

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

  // const handleSubjectRequest = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const email = localStorage.getItem('studentEmail');
  //     if (!email) {
  //       alert('You must be logged in to request a subject');
  //       return;
  //     }

  //     const studentRes = await api.get(`/student/details/${email}`);
  //     const studentId = studentRes.data._id;

  //     await api.post('/requests/subject', {
  //       studentId,
  //       subject: newSubjectRequest.subject,
  //       reason: newSubjectRequest.reason
  //     });

  //     alert('Subject request submitted successfully!');
  //     setIsSubjectModalOpen(false);
  //     setNewSubjectRequest({
  //       subject: '',
  //       reason: ''
  //     });
  //   } catch (error: any) {
  //     console.error('Error submitting subject request:', error);
  //     alert(`Failed to submit request: ${error.response?.data?.message || error.message}`);
  //   }
  // };

  const handleSubjectRequest = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const email = localStorage.getItem('studentEmail');
    if (!email) {
      alert('You must be logged in to request a subject');
      return;
    }
<<<<<<< Updated upstream
  };

  // Fee Overview Component
  const FeeOverview = () => {
    const [feeData, setFeeData] = useState({
      totalDue: 0,
      unpaidClassCount: 0,
      unpaidClassIds: [] as string[],
      lastPaymentDate: null as Date | null,
      loading: true,
      error: null as string | null
    });
    const [isLoading, setIsLoading] = useState(false);
    const razorpayLoaded = useRef(false);

    useEffect(() => {
      if (!razorpayLoaded.current) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          razorpayLoaded.current = true;
        };
        document.body.appendChild(script);
        
        return () => {
          document.body.removeChild(script);
        };
      }
    }, []);

    useEffect(() => {
      fetchFeeData();
    }, []);

    const fetchFeeData = async () => {
      try {
        const email = localStorage.getItem('studentEmail');
        if (!email) return;
        
        // First get student details to get ID
        const studentRes = await api.get(`/student/details/${email}`);
        const studentId = studentRes.data._id;
        
        // Then get unpaid fees
        const feesRes = await api.get(`/classes/fees/unpaid/${studentId}`);
        
        setFeeData({
          totalDue: feesRes.data.data.totalDue || 0,
          unpaidClassCount: feesRes.data.data.unpaidClassCount || 0,
          unpaidClassIds: feesRes.data.data.unpaidClassIds || [],
          lastPaymentDate: null,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching fee data:', error);
        setFeeData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load fee information'
        }));
      }
    };

    const handleMakePayment = () => {
      if (feeData.totalDue <= 0) {
        alert('No payment due.');
        return;
      }
      
      setIsLoading(true);
      
      const options = {
        key: 'rzp_live_VVQ3SO2EEv78so',
        amount: feeData.totalDue * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'AI-Connect',
        description: `Payment for ${feeData.unpaidClassCount} classes`,
        image: 'https://your-logo-url.com/logo.png',
        handler: async function(response: any) {
          try {
            const email = localStorage.getItem('studentEmail');
            if (!email) return;
            
            // Mark classes as paid
            await api.post('/classes/fees/pay', {
              classIds: feeData.unpaidClassIds,
              paymentId: response.razorpay_payment_id
            });
            
            // Refresh fee data
            fetchFeeData();
            
            alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
          } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Payment recorded but failed to update status. Please contact support.');
          }
          
          setIsLoading(false);
        },
        prefill: {
          name: profileData.name,
          email: localStorage.getItem('studentEmail') || '',
          contact: ''
        },
        theme: {
          color: '#3c4e92'
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      try {
        if (typeof window.Razorpay === 'function') {
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        } else {
          alert("Payment gateway is loading. Please try again in a moment.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error initializing Razorpay", err);
        alert("Unable to load payment gateway. Please try again later.");
        setIsLoading(false);
      }
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
    };

    if (feeData.loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navbar"></div>
        </div>
      );
    }

    if (feeData.error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {feeData.error}</p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Due Card */}
        <div className="bg-white rounded-lg p-5 flex items-center">
          <div className="w-14 h-14 rounded-full bg-navbar bg-opacity-10 flex items-center justify-center mr-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-navbar"
            >
              <rect width="20" height="12" x="2" y="6" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M6 12h.01M18 12h.01" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Payment Due</p>
            <p className="text-2xl font-bold text-text-primary">{formatCurrency(feeData.totalDue)}</p>
            {feeData.unpaidClassCount > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                For {feeData.unpaidClassCount} completed {feeData.unpaidClassCount === 1 ? 'class' : 'classes'}
              </p>
            )}
          </div>
        </div>
        
        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg p-5">
          <p className="text-gray-500 text-sm mb-4">Quick Actions</p>
          <div className="space-y-3">
            <button
              onClick={handleMakePayment}
              disabled={feeData.totalDue <= 0 || isLoading}
              className={`w-full py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors
                ${feeData.totalDue <= 0 || isLoading 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-navbar text-white hover:bg-opacity-90'}`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  Make Payment
                </>
              )}
            </button>
            <Link to="/student/fee-details" className="w-full bg-white border border-gray-200 text-text-primary py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
              View Full Details
            </Link>
          </div>
        </div>
        
        {/* Payment Status Visual */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-lg p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-500 text-sm">Payment Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${feeData.totalDue > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {feeData.totalDue > 0 ? 'Payment Pending' : 'All Paid'}
            </span>
          </div>
          
          {feeData.totalDue > 0 ? (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-navbar h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {feeData.unpaidClassCount} {feeData.unpaidClassCount === 1 ? 'class' : 'classes'} pending payment at ₹500 per class
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">You have no pending payments. Great job staying up to date!</p>
          )}
        </div>
      </div>
    );
  };
=======

    // Get student ID
    const studentRes = await api.get(`/student/details/${email}`);
    const studentId = studentRes.data._id;

    await api.post('/requests/subject', {
      studentId, // Send student ID instead of email
      subject: newSubjectRequest.subject,
      reason: newSubjectRequest.reason
    });

    alert('Subject request submitted successfully!');
    setIsSubjectModalOpen(false);
    setNewSubjectRequest({ subject: '', reason: '' });
    
    // Refresh subjects list
    const updatedStudent = await api.get(`/student/details/${email}`);
    setSubjects(updatedStudent.data.subjects.map((s: any) => s.subject));
  } catch (error: any) {
    console.error('Error submitting subject request:', error);
    alert(`Failed to submit request: ${error.response?.data?.message || error.message}`);
  }
};
>>>>>>> Stashed changes
  
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

          {/* Profile and Fee Summary Section */}
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
                        className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm text-text-primary transform hover:scale-105 transition-all duration-300"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No subjects enrolled</p>
                  )}
                  </div>
                  <button
                    onClick={() => setIsSubjectModalOpen(true)}
                    className="mt-3 text-navbar hover:text-button-secondary flex items-center gap-1 text-sm"
                  >
                    <Plus size={16} />
                    Request new subject
                  </button>
                </div>
              </div>
            </div>

            {/* Fee Summary - Replacing Progress Overview */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Fee Summary</h2>
              </div>
              
              <FeeOverview />
            </div>
          </div>

          {/* Enrolled Classes Section */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navbar"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-48">
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
                          className="flex-1 bg-white border border-gray-200 text-text-primary py-2 rounded-lg hover:bg-gray-50 transition-colors"
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

        {/* Subject Request Modal */}
        {isSubjectModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 transform scale-100 transition-transform duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Request New Subject</h3>
                <button 
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubjectRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={newSubjectRequest.subject}
                    onChange={(e) => setNewSubjectRequest({...newSubjectRequest, subject: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                    required
                  >
                    <option value="">Select a subject</option>
                    {availableSubjects
                      .filter(subject => !subjects.includes(subject))
                      .map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request</label>
                  <textarea
                    value={newSubjectRequest.reason}
                    onChange={(e) => setNewSubjectRequest({...newSubjectRequest, reason: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-navbar focus:outline-none"
                    rows={3}
                    placeholder="Why do you want to add this subject?"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-navbar text-white py-2 rounded-lg hover:bg-button-secondary transition-colors transform hover:scale-[1.02]"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Schedule/Reschedule Class Modals */}
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

// Add this type declaration for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default StudentProfile;