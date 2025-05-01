import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, BookOpen, Filter, Search, Play, RotateCcw, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import api from '../../api';

interface ClassSession {
  _id: string;
  subject: string;
  teacherId: {
    _id: string;
    name: string;
  };
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
  meetingId?: string;
  meetingLink?: string;
  recording?: string;
  notes?: string;
}

const MyClasses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        // Get the student email from localStorage
        const email = localStorage.getItem('studentEmail');
        
        if (!email) {
          setError('User not logged in');
          setLoading(false);
          return;
        }
        
        // First get the student ID
        const studentRes = await api.get(`/student/details/${email}`);
        const studentId = studentRes.data._id;
        
        // Then fetch their classes
        const classesRes = await api.get(`/classes/student/${studentId}`);
        setClasses(classesRes.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching classes:', err);
        setError(err.response?.data?.message || 'Failed to load classes');
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, []);
  
  const handleJoinClass = (classId: string) => {
    navigate(`/class/${classId}`);
  };
  
  const handleRescheduleClass = (classId: string) => {
    // You can implement this later to open a reschedule modal
    alert('Reschedule functionality will be implemented soon');
  };
  
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.teacherId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map the backend status values to UI status values
    const uiStatus = classItem.status === 'scheduled' ? 'upcoming' : classItem.status;
    const matchesStatus = filterStatus === 'all' || uiStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'rescheduled':
        return 'Rescheduled';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => {}} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">My Classes</h1>
            <p className="text-text-secondary mt-2">Manage your class schedule and recordings</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search classes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navbar"
                >
                  <option value="all">All Classes</option>
                  <option value="scheduled">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading, Error, or Empty States */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-navbar h-8 w-8" />
              <span className="ml-2 text-navbar">Loading classes...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Classes Found</h3>
              <p className="text-gray-500">
                {filterStatus !== 'all' 
                  ? `You don't have any ${filterStatus} classes.` 
                  : 'You don\'t have any classes scheduled yet.'}
              </p>
              <Link 
                to="/student-profile" 
                className="mt-4 inline-block px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90"
              >
                Request a Class
              </Link>
            </div>
          ) : (
            /* Classes Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <div key={classItem._id} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{classItem.subject}</h3>
                      <div className="flex items-center gap-2 text-gray-500 mt-1">
                        <User size={16} />
                        <p className="text-sm">{classItem.teacherId?.name || 'Teacher'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(classItem.status)}`}>
                      {getDisplayStatus(classItem.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <p className="text-sm">{new Date(classItem.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <p className="text-sm">{classItem.time} (1 hour)</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {classItem.status === 'scheduled' && (
                      <button 
                        onClick={() => handleJoinClass(classItem._id)}
                        className="flex-1 bg-navbar text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play size={16} />
                        Join Class
                      </button>
                    )}
                    {classItem.status === 'scheduled' && (
                      <button 
                        onClick={() => handleRescheduleClass(classItem._id)}
                        className="flex-1 bg-red-100 text-red-800 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={16} />
                        Reschedule
                      </button>
                    )}
                    {classItem.status === 'completed' && classItem.recording && (
                      <button className="flex-1 bg-green-100 text-green-800 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                        <Play size={16} />
                        Watch Recording
                      </button>
                    )}
                    {classItem.status === 'completed' && !classItem.recording && (
                      <span className="flex-1 py-2 text-center text-gray-500 text-sm">
                        Recording not available
                      </span>
                    )}
                  </div>
                  
                  {classItem.status === 'completed' && classItem.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <BookOpen size={16} className="inline-block mr-2" />
                        {classItem.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClasses;