import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Mail, MessageSquare } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../api';

interface FeedbackItem {
  id: string;
  studentName: string;
  studentEmail: string;
  teacherName: string;
  subject: string;
  date: string;
  rating?: number;
  feedback: string;
  feedbackType: 'studentToTutor' | 'tutorToStudent';
}

const AdminFeedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'studentToTutor' | 'tutorToStudent'>('studentToTutor');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await api.get('/feedback/all');
        
        const formattedFeedback = response.data.map((item: any) => ({
          id: item._id,
          studentName: item.studentId ? item.studentId.name : 'Unknown Student',
          studentEmail: item.studentId ? item.studentId.email : '',
          teacherName: item.teacherId ? item.teacherId.name : 'Unknown Teacher',
          subject: item.subject,
          date: new Date(item.createdAt).toLocaleDateString(),
          rating: item.rating,
          feedback: item.feedback,
          feedbackType: item.feedbackType || 'studentToTutor'
        }));
        
        setFeedbackItems(formattedFeedback);
        
        // Extract unique subjects
        const uniqueSubjects = Array.from(new Set(formattedFeedback.map((item: any) => item.subject)));
        setSubjects(uniqueSubjects);
        
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  const filteredFeedback = feedbackItems.filter(item => {
    const matchesTab = activeTab === 'all' || item.feedbackType === activeTab;
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSubject = filterSubject === 'all' || item.subject === filterSubject;
    
    return matchesSearch && matchesSubject && matchesTab;
  });

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Feedback</h1>
            <p className="text-text-secondary mt-2">Review feedback between students and tutors</p>
          </div>

          {/* Tabs */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'studentToTutor' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-500'}`}
                onClick={() => setActiveTab('studentToTutor')}
              >
                Student → Tutor Feedback
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'tutorToStudent' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-500'}`}
                onClick={() => setActiveTab('tutorToStudent')}
              >
                Tutor → Student Feedback
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or subject..."
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
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navbar"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Feedback List */}
          {!loading && !error && (
            <div className="space-y-6">
              {filteredFeedback.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No feedback found in this category</p>
                </div>
              ) : (
                filteredFeedback.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">{item.subject}</h3>
                        <div className="flex flex-col md:flex-row md:gap-4">
                          <p className="text-gray-500">
                            <span className="font-medium">Student:</span> {item.studentName}
                          </p>
                          <p className="text-gray-500">
                            <span className="font-medium">Teacher:</span> {item.teacherName}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">Date: {item.date}</p>
                      </div>
                      
                      {/* Only show stars for student->tutor feedback */}
                      {item.feedbackType === 'studentToTutor' && item.rating && (
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              size={18}
                              className={index < (item.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* Show feedback type indicator */}
                      {item.feedbackType === 'tutorToStudent' && (
                        <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                          Tutor Feedback
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">{item.feedback}</p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      {item.feedbackType === 'studentToTutor' ? (
                        <a 
                          href={`mailto:${item.studentEmail}`} 
                          className="flex items-center gap-2 text-navbar hover:text-opacity-80 transition-colors"
                        >
                          <Mail size={18} />
                          <span>Contact Student</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <MessageSquare size={18} />
                          <span>Tutor Provided Feedback</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;