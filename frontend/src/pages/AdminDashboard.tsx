import React, { useEffect, useState } from 'react';
import { Users, BookOpen, DollarSign, Activity, Check, X } from 'lucide-react';
import Sidebar from '../components/AdminSidebar';
import api from '../api';
import { ClassRequest as ClassRequestType, ScheduledClass, StudentDetails } from '../types';

interface ClassRequest {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface TimeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ClassRequest | null;
  onSchedule: (id: string, time: string) => void;
}

const TimeSelectionModal: React.FC<TimeSelectionModalProps> = ({ isOpen, onClose, request, onSchedule }) => {
  const [selectedTime, setSelectedTime] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(request.id, selectedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Select Time for {request.name}'s Class</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90"
            >
              Schedule Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    tutors: 0,
    students: 0,
    activeClasses: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  // Use stats from state instead of hardcoded values
  const stats = [
    { title: 'Total Tutors', value: loading ? '...' : statsData.tutors.toString(), icon: <Users className="w-6 h-6" />,  bgColor: 'bg-blue-50' },
    { title: 'Total Students', value: loading ? '...' : statsData.students.toString(), icon: <Users className="w-6 h-6" />, bgColor: 'bg-green-50' },
    { title: 'Active Classes', value: loading ? '...' : statsData.activeClasses.toString(), icon: <BookOpen className="w-6 h-6" />, bgColor: 'bg-yellow-50' },
  ];

  const [studentRequests, setStudentRequests] = useState<ClassRequest[]>([]);
  const [scheduledClasses, setScheduledClasses] = useState<ClassRequest[]>([]);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ClassRequest | null>(null);

  // Add a new useEffect to fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      // Inside the fetchStatistics function
      try {
        setLoading(true);
        
        // Make parallel requests for better performance
        console.log('Fetching admin stats...');
        const [tutorsRes, studentsRes, classesRes] = await Promise.all([
          api.get('/admin/stats/tutors'),
          api.get('/admin/stats/students'),
          api.get('/admin/stats/active-classes')
        ]);
        
        console.log('Tutors response:', tutorsRes.data);
        console.log('Students response:', studentsRes.data);
        console.log('Classes response:', classesRes.data);
        
        setStatsData({
          tutors: tutorsRes.data.count || 0,
          students: studentsRes.data.count || 0,
          activeClasses: classesRes.data.count || 0
        });
        
        console.log('Updated stats state:', {
          tutors: tutorsRes.data.count || 0,
          students: studentsRes.data.count || 0,
          activeClasses: classesRes.data.count || 0
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // More detailed error logging
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        // Set fallback values in case of error
        setStatsData({
          tutors: 0,
          students: 0,
          activeClasses: 0
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, []); // Empty dependency array to run only once on component mount

  const approveStudent = (request: ClassRequest) => {
    setSelectedRequest(request);
    setIsTimeModalOpen(true);
  };

  // Update the useEffect for fetching requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/requests/class/pending');
        setStudentRequests(res.data.map((req: { _id: any; studentId: { name: any; }; subject: any; requestedDate: string | number | Date; status: any; }) => ({
          id: req._id,
          name: req.studentId.name,
          subject: req.subject,
          date: new Date(req.requestedDate).toLocaleDateString(),
          time: '',
          status: req.status
        })));
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    fetchRequests();
  }, []);

  // Update handleScheduleClass
  const handleScheduleClass = async (id: string, time: string) => {
    try {
      const response = await api.post('/classes/schedule', {
        requestId: id,
        time
      });

      if (response.data && response.data.meetingLink) {
        // Update local state only after successful response
        setStudentRequests(prev => prev.filter(req => req.id !== id));
        setScheduledClasses(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Scheduling error:', error);
      if (error instanceof Error) {
        alert(`Failed to schedule class: ${(error as any)?.response?.data?.message || error.message}`);
      } else {
        alert('Failed to schedule class: An unknown error occurred.');
      }
      // Optionally: Re-add the request to the UI if failed
    }
  };

  const rejectStudent = (id: string) => {
    setStudentRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-text-secondary mt-2">Manage your platform and users</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} p-6 rounded-lg shadow-md hover:scale-105 transition-transform`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-text-secondary mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                  <div className="text-navbar">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Student Requests */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Student Class Requests</h2>
            {studentRequests.length === 0 ? (
              <p className="text-gray-500">No class requests</p>
            ) : (
              <div className="space-y-4">
                {studentRequests.map((req) => (
                  <div key={req.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{req.name}</p>
                      <p className="text-gray-500">{req.subject}</p>
                      <p className="text-gray-500">{req.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="text-green-600 hover:text-green-800" 
                        onClick={() => approveStudent(req)}
                      >
                        <Check size={20} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800" 
                        onClick={() => rejectStudent(req.id)}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Classes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Scheduled Classes</h2>
            {scheduledClasses.length === 0 ? (
              <p className="text-gray-500">No scheduled classes</p>
            ) : (
              <div className="space-y-4">
                {scheduledClasses.map((sc) => (
                  <div key={sc.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{sc.name}</p>
                    <p className="text-gray-500">{sc.subject}</p>
                    <p className="text-gray-500">{sc.date} at {sc.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Time Selection Modal */}
      <TimeSelectionModal
        isOpen={isTimeModalOpen}
        onClose={() => {
          setIsTimeModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        onSchedule={handleScheduleClass}
      />
    </div>
  );
}