import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import GenerateCredentialsModal from '../components/GenerateCredentialsModal';

interface StudentBooking {
  id: string;
  fullName: string;
  email: string;
  grade: string;
  subject: string;
  date: string;
}

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data from book class form submissions
  const [students] = useState<StudentBooking[]>([
    {
      id: '1',
      fullName: 'John Doe',
      email: 'john@example.com',
      grade: '10th Grade',
      subject: 'Mathematics',
      date: '2024-03-15'
    },
    {
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      grade: '11th Grade',
      subject: 'Physics',
      date: '2024-03-16'
    },
    {
      id: '3',
      fullName: 'Mike Johnson',
      email: 'mike@example.com',
      grade: '9th Grade',
      subject: 'Chemistry',
      date: '2024-03-17'
    }
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || student.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(students.map(student => student.subject))];

  const handleGenerateCredentials = (student: StudentBooking) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

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
                  {filteredStudents.map((student) => (
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
                          onClick={() => handleGenerateCredentials(student)}
                          className="text-navbar hover:text-opacity-80"
                        >
                          Generate Credentials
                        </button>
                      </td>
                    </tr>
                  ))}
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
      />
    </div>
  );
};

export default Students;