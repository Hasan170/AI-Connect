import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Phone, Mail, BookOpen } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import api from '../../api';

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  expertise: string;  // For mapping from the backend
  experience: string | number;
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        
        // Get student email from localStorage
        const email = localStorage.getItem('studentEmail');
        if (!email) {
          throw new Error('User not logged in');
        }
        
        // First get student details to get subjects and their assigned teachers
        const studentRes = await api.get(`/student/details/${email}`);
        const student = studentRes.data;
        
        // Extract subject names for filter
        const subjects = student.subjects.map((s: any) => s.subject);
        setStudentSubjects(subjects);
        
        // Get teacher IDs
        const teacherIds = student.subjects.map((s: any) => s.teacherId);
        
        // Get teacher details
        let teachersData: Teacher[] = [];
        
        for (const subject of student.subjects) {
          if (subject.teacherId) {
            try {
              // Fetch teacher details for each assigned teacher
              const teacherRes = await api.get(`/teacher/details/byid/${subject.teacherId}`);
              const teacherData = teacherRes.data;
              
              // Check if teacher already exists in array
              const existingTeacher = teachersData.find(t => t.id === subject.teacherId);
              
              if (existingTeacher) {
                // Add subject to existing teacher if not already included
                if (!existingTeacher.subjects.includes(subject.subject)) {
                  existingTeacher.subjects.push(subject.subject);
                }
              } else {
                // Add new teacher
                teachersData.push({
                  id: teacherData._id,
                  name: teacherData.name,
                  subjects: [subject.subject],
                  expertise: teacherData.expertise,
                  experience: `${teacherData.experience} years`,
                  rating: 4.8, // Default or you could add this to your schema
                  totalReviews: 150, // Default or you could add this to your schema
                  email: teacherData.email,
                  phone: '+1 234-567-8901', // Default or you could add this to your schema
                  availability: 'Mon-Fri, 9 AM - 5 PM', // Default or you could add this to your schema
                  imageUrl: '/dp.png' // Default image
                });
              }
            } catch (err) {
              console.error(`Error fetching teacher ${subject.teacherId}:`, err);
            }
          }
        }
        
        setTeachers(teachersData);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeachers();
  }, []);

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

          {/* Loading and Error States */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navbar"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No teachers found for your subjects.</p>
            </div>
          ) : (
            /* Teachers Grid */
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teachers;