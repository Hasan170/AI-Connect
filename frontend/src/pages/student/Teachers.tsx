import React, { useState } from 'react';
import { Search, Filter, Star, Phone, Mail, BookOpen } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  experience: string;
  rating: number;
  totalReviews: number;
  email: string;
  phone: string;
  availability: string;
  imageUrl: string;
}

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const teachers: Teacher[] = [
    {
      id: '1',
      name: 'Dr. Sarah Smith',
      subjects: ['Mathematics', 'Physics'],
      experience: '8 years',
      rating: 4.8,
      totalReviews: 156,
      email: 'sarah.smith@aiconnect.com',
      phone: '+1 234-567-8901',
      availability: 'Mon-Fri, 9 AM - 5 PM',
      imageUrl: '/dp.png'
    },
    {
      id: '2',
      name: 'Prof. John Davis',
      subjects: ['Chemistry', 'Biology'],
      experience: '12 years',
      rating: 4.9,
      totalReviews: 203,
      email: 'john.davis@aiconnect.com',
      phone: '+1 234-567-8902',
      availability: 'Mon-Sat, 10 AM - 6 PM',
      imageUrl: '/dp.png'
    },
    {
      id: '3',
      name: 'Ms. Emily Johnson',
      subjects: ['English', 'Literature'],
      experience: '6 years',
      rating: 4.7,
      totalReviews: 128,
      email: 'emily.johnson@aiconnect.com',
      phone: '+1 234-567-8903',
      availability: 'Tue-Sat, 11 AM - 7 PM',
      imageUrl: '/dp.png'
    }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subjects.some(subject => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSubject = filterSubject === 'all' || 
      teacher.subjects.includes(filterSubject);
    return matchesSearch && matchesSubject;
  });

  const allSubjects = Array.from(
    new Set(teachers.flatMap(teacher => teacher.subjects))
  );

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => {}} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">My Teachers</h1>
            <p className="text-text-secondary mt-2">Connect with your teachers and schedule classes</p>
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
                  {allSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Teachers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                    <img 
                      src={teacher.imageUrl} 
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary">{teacher.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {teacher.subjects.map(subject => (
                        <span 
                          key={subject}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen size={16} />
                    <span className="text-sm">Experience: {teacher.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {teacher.rating} ({teacher.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button 
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    onClick={() => window.location.href = `mailto:${teacher.email}`}
                  >
                    <Mail size={16} />
                    Contact
                  </button>
                  <button 
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-navbar text-navbar rounded-lg hover:bg-navbar hover:text-white transition-all duration-300"
                  >
                    <BookOpen size={16} />
                    Schedule Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teachers;