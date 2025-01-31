import React, { useState } from 'react';
import { Search, Filter, FileText, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

interface Assignment {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  feedback?: string;
}

const Assignments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const assignments: Assignment[] = [
    {
      id: '1',
      subject: 'Mathematics',
      title: 'Calculus Homework',
      description: 'Complete exercises 1-10 from Chapter 5',
      dueDate: '2025-02-15',
      status: 'pending'
    },
    {
      id: '2',
      subject: 'Physics',
      title: 'Lab Report',
      description: 'Write a detailed report on the pendulum experiment',
      dueDate: '2025-02-10',
      status: 'submitted'
    },
    {
      id: '3',
      subject: 'Chemistry',
      title: 'Research Paper',
      description: 'Submit research paper on organic compounds',
      dueDate: '2025-02-05',
      status: 'graded',
      grade: 'A',
      feedback: 'Excellent work! Very well researched.'
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'submitted':
        return <AlertCircle size={16} />;
      case 'graded':
        return <CheckCircle size={16} />;
      case 'overdue':
        return <X size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => {}} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Assignments</h1>
            <p className="text-text-secondary mt-2">Track and manage your assignments</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search assignments..."
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
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assignments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{assignment.title}</h3>
                    <p className="text-sm text-gray-500">{assignment.subject}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(assignment.status)}`}>
                    {getStatusIcon(assignment.status)}
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{assignment.description}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <p className="text-sm">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {assignment.status === 'pending' && (
                  <button className="mt-4 w-full bg-navbar text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                    <FileText size={16} />
                    Submit Assignment
                  </button>
                )}

                {assignment.status === 'graded' && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle size={16} />
                      <p className="text-sm font-medium">Grade: {assignment.grade}</p>
                    </div>
                    <p className="text-sm text-gray-600">{assignment.feedback}</p>
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

export default Assignments;