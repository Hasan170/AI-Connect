import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Sidebar from '../../components/AdminSidebar';
import GenerateTeacherCredentialsModal from '../../components/GenerateTeacherCredentialsModal';

interface TeacherApplication {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  experience: string;
  qualification: string;
  applicationDate: string;
}

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data from become a tutor form submissions
  const [teachers] = useState<TeacherApplication[]>([
    {
      id: '1',
      fullName: 'Dr. Sarah Williams',
      email: 'sarah@example.com',
      subject: 'Physics',
      experience: '5 years',
      qualification: 'PhD in Physics',
      applicationDate: '2024-03-15'
    },
    {
      id: '2',
      fullName: 'Prof. Michael Brown',
      email: 'michael@example.com',
      subject: 'Mathematics',
      experience: '8 years',
      qualification: 'MSc in Mathematics',
      applicationDate: '2024-03-16'
    },
    {
      id: '3',
      fullName: 'Dr. Emily Chen',
      email: 'emily@example.com',
      subject: 'Chemistry',
      experience: '6 years',
      qualification: 'PhD in Chemistry',
      applicationDate: '2024-03-17'
    }
  ]);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || teacher.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(teachers.map(teacher => teacher.subject))];

  const handleGenerateCredentials = (teacher: TeacherApplication) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Teachers</h1>
            <p className="text-text-secondary mt-2">Manage teacher applications and profiles</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search teachers..."
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

          {/* Teachers Table */}
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
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {teacher.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.experience}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.qualification}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{teacher.applicationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleGenerateCredentials(teacher)}
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
      <GenerateTeacherCredentialsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teacher={selectedTeacher}
      />
    </div>
  );
};

export default Teachers;