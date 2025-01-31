import React, { useState } from 'react';
import { Calendar, Clock, User, BookOpen, Filter, Search, Play, RotateCcw } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

interface ClassSession {
  id: string;
  subject: string;
  teacherName: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  recording?: string;
  notes?: string;
}

const MyClasses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const classes: ClassSession[] = [
    {
      id: '1',
      subject: 'Mathematics',
      teacherName: 'Dr. Smith',
      date: '2024-03-20',
      time: '10:00 AM',
      duration: '1 hour',
      status: 'upcoming',
    },
    {
      id: '2',
      subject: 'Physics',
      teacherName: 'Prof. Johnson',
      date: '2024-03-19',
      time: '2:00 PM',
      duration: '1 hour',
      status: 'completed',
      recording: 'physics_class_recording.mp4',
      notes: 'Chapter 5: Quantum Mechanics',
    },
    {
      id: '3',
      subject: 'Chemistry',
      teacherName: 'Dr. Williams',
      date: '2024-03-18',
      time: '11:00 AM',
      duration: '1 hour',
      status: 'cancelled',
    },
  ];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || classItem.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <div key={classItem.id} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{classItem.subject}</h3>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <User size={16} />
                      <p className="text-sm">{classItem.teacherName}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(classItem.status)}`}>
                    {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <p className="text-sm">{new Date(classItem.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <p className="text-sm">{classItem.time} ({classItem.duration})</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {classItem.status === 'upcoming' && (
                    <button className="flex-1 bg-navbar text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                      <Play size={16} />
                      Join Class
                    </button>
                  )}
                  {classItem.status === 'upcoming' && (
                    <button className="flex-1 bg-red-100 text-red-800 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default MyClasses;