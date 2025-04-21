import React, { useState, useEffect } from 'react';
import { Search, Filter, Check, X } from 'lucide-react';
import Sidebar from '../../components/AdminSidebar';
import api from '../../api';

interface SubjectRequestType {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
    grade: string;
    board: string;
  };
  subject: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface TeacherType {
  _id: string;
  name: string;
  expertise: string;
  experience: number;
}

const SubjectRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [requests, setRequests] = useState<SubjectRequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch pending subject requests
        const requestsRes = await api.get('/requests/subject/pending');
        setRequests(requestsRes.data);
        
        // Fetch all teachers for assignment
        const teachersRes = await api.get('/teacher/details');
        setTeachers(teachersRes.data);
        
        // Initialize selected teachers
        const initialTeachers: {[key: string]: string} = {};
        requestsRes.data.forEach((request: SubjectRequestType) => {
          initialTeachers[request._id] = '';
        });
        setSelectedTeachers(initialTeachers);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No requests at the moment!');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleTeacherSelection = (requestId: string, teacherId: string) => {
    setSelectedTeachers({
      ...selectedTeachers,
      [requestId]: teacherId
    });
  };
  
  const handleApproveRequest = async (requestId: string) => {
    try {
      const teacherId = selectedTeachers[requestId];
      if (!teacherId) {
        alert('Please select a teacher before approving the request');
        return;
      }
      
      await api.post('/requests/subject/approve', {
        requestId,
        teacherId
      });
      
      // Remove the approved request from the list
      setRequests(requests.filter(request => request._id !== requestId));
      
    } catch (error: any) {
      console.error('Error approving request:', error);
      alert(`Failed to approve request: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      // Implement reject logic here
      // For now, just remove from UI
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      alert(`Failed to reject request: ${error.message}`);
    }
  };
  
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.studentId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.studentId.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || request.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });
  
  const subjects = ['all', ...new Set(requests.map(request => request.subject))];
  
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Subject Requests</h1>
            <p className="text-text-secondary mt-2">Manage student subject enrollment requests</p>
          </div>
          
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navbar"
                >
                  <option value="all">All Subjects</option>
                  {subjects.slice(1).map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Requests Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assign Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navbar"></div>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No subject requests found
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">{request.studentId.name}</div>
                            <div className="text-sm text-gray-500">{request.studentId.email}</div>
                            <div className="text-sm text-gray-500">
                              Grade {request.studentId.grade}, {request.studentId.board}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {request.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs text-sm text-gray-900 overflow-hidden text-ellipsis">
                            {request.reason}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={selectedTeachers[request._id] || ''}
                            onChange={(e) => handleTeacherSelection(request._id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-navbar"
                            required
                          >
                            <option value="">Select a teacher</option>
                            {teachers.filter(teacher => 
                              teacher.expertise.toLowerCase().includes(request.subject.toLowerCase())
                            ).map((teacher) => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.name} ({teacher.experience} yrs exp)
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRequest(request._id)}
                              className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectRequests;