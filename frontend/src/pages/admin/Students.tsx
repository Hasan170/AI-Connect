import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Sidebar from '../../components/AdminSidebar';
import GenerateCredentialsModal from '../../components/GenerateCredentialsModal';
import api from '../../api';

interface StudentBooking {
  id: string;
  fullName: string;
  email: string;
  grade: string;
  subject: string;
  date: string;
  password?: string; 
}

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentRequests = async () => {
      try {
        const response = await api.get('/requests/pending');
        const studentRequests = response.data.students.map((request: any) => ({
          id: request._id,
          fullName: request.fullName,
          email: request.email,
          grade: request.grade,
          subject: request.subject,
          date: new Date(request.preferredDate).toLocaleDateString()
        }));
        setStudents(studentRequests);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch student requests');
        setLoading(false);
      }
    };
  
    fetchStudentRequests();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || student.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(students.map(student => student.subject))];

  // const handleGenerateCredentials = async (studentData: StudentBooking) => {
  //   try {
  //     // First create student credentials s
  //     await api.post('/api/students/create', {
  //       name: studentData.fullName,
  //       email: studentData.email,
  //       grade: studentData.grade,
  //       password: "TEMPORARY_PASSWORD" // You'll want to generate this
  //     });
  
  //     // Then delete the request
  //     await api.delete(`/requests/student/${studentData.id}`);
      
  //     // Update local state
  //     setStudents(prev => prev.filter(s => s.id !== studentData.id));
  //     setIsModalOpen(false);
  //     alert('Credentials generated successfully!');
  //   } catch (err) {
  //     console.error('Generation error:', err);
  //     alert('Failed to generate credentials. Please check console for details.');
  //   }
  // };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Students</h1>
            <p className="text-text-secondary mt-2">Manage student bookings and classes</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search students..."
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
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No student requests found
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{student.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {student.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsModalOpen(true);
                            }}
                            className="text-navbar hover:text-opacity-80 bg-blue-50 px-4 py-2 rounded-lg transition-all"
                          >
                            Generate Credentials
                          </button>
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
      <GenerateCredentialsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        onSuccess={(studentId) => {
          setStudents(prev => prev.filter(t => t.id !== studentId));
          setSelectedStudent(null);
        }}
        // onSubmit={async (credentials) => {
        //   if (selectedStudent) {
        //     await handleGenerateCredentials({
        //       ...selectedStudent,
        //       ...credentials
        //     });
        //   }
        // }}
      />
    </div>
  );
};

export default Students;