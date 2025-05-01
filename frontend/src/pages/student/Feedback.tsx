import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Search, Filter, ThumbsUp, Send, PlusCircle, Clock } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import api from '../../api';

interface FeedbackItem {
  id: string;
  teacherName: string;
  expertise?: string;
  subjects: string[];
  feedbacks?: {
    id: string;
    subject: string;
    rating: number;
    feedback: string;
    createdAt: string;
  }[];
  status: 'pending' | 'submitted';
}

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isAddingNewFeedback, setIsAddingNewFeedback] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        
        // Get student email from localStorage
        const email = localStorage.getItem('studentEmail');
        if (!email) {
          throw new Error('User not logged in');
        }
        
        // Get student ID
        const studentRes = await api.get(`/student/details/${email}`);
        const studentId = studentRes.data._id;
        setStudentId(studentId);
        
        // Get teachers for feedback with their feedback status
        const teachersRes = await api.get(`/feedback/student/${studentId}/teachers-with-feedbacks`);
        setFeedbackItems(teachersRes.data);
        
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, []);

  const filteredFeedback = feedbackItems.filter(item => {
    const matchesSearch = 
      item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subjects && item.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmitFeedback = async (teacherId: string) => {
    if (!studentId) {
      alert('User session lost. Please login again.');
      return;
    }
    
    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }
    
    try {
      const response = await api.post('/feedback/submit', {
        studentId,
        teacherId,
        subject: selectedSubject,
        rating: selectedRating,
        feedback: feedbackText
      });
      
      const newFeedback = response.data.feedback;
      
      // Update the local state to reflect the submitted feedback
      setFeedbackItems(prevItems => prevItems.map(item => {
        if (item.id === teacherId) {
          // Create feedbacks array if it doesn't exist
          const currentFeedbacks = item.feedbacks || [];
          
          return {
            ...item,
            feedbacks: [
              ...currentFeedbacks,
              {
                id: newFeedback._id,
                subject: selectedSubject,
                rating: selectedRating,
                feedback: feedbackText,
                createdAt: newFeedback.createdAt
              }
            ],
            // Only change status to submitted if this is the first feedback
            status: 'submitted'
          };
        }
        return item;
      }));
      
      // Reset form state
      setActiveFeedback(null);
      setIsAddingNewFeedback(false);
      setFeedbackText('');
      setSelectedRating(0);
      setSelectedSubject('');
      
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => {}} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Teacher Feedback</h1>
            <p className="text-text-secondary mt-2">Share your experience with your teachers</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by teacher or subject..."
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
                  <option value="pending">Not Rated Yet</option>
                  <option value="submitted">Already Rated</option>
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
              {filteredFeedback.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{item.teacherName}</h3>
                      <p className="text-gray-500">{item.expertise}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.subjects?.map(subject => (
                          <span 
                            key={subject}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      item.status === 'submitted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status === 'submitted' ? 
                        `${item.feedbacks?.length || 1} Feedback${(item.feedbacks?.length || 1) > 1 ? 's' : ''}` : 
                        'Not Rated'}
                    </span>
                  </div>

                  {/* Show previous feedbacks */}
                  {item.feedbacks && item.feedbacks.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {item.feedbacks.map((feedback) => (
                        <div key={feedback.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  size={18}
                                  className={index < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                              <span className="text-sm font-medium text-gray-700 ml-2">{feedback.subject}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock size={14} className="mr-1" />
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{feedback.feedback}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new feedback form */}
                  {activeFeedback === item.id && isAddingNewFeedback ? (
                    <div className="mt-4 space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-navbar">Add New Feedback</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <select
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                          required
                        >
                          <option value="">Select subject</option>
                          {item.subjects?.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedRating(index + 1)}
                              className="focus:outline-none"
                              type="button"
                            >
                              <Star
                                size={24}
                                className={index < selectedRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Share your experience with this teacher..."
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveFeedback(null);
                            setIsAddingNewFeedback(false);
                            setSelectedSubject('');
                            setSelectedRating(0);
                            setFeedbackText('');
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitFeedback(item.id)}
                          disabled={!selectedRating || !feedbackText.trim() || !selectedSubject}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            !selectedRating || !feedbackText.trim() || !selectedSubject
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                              : 'bg-navbar text-white hover:bg-opacity-90'
                          }`}
                          type="button"
                        >
                          <Send size={16} />
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => {
                          setActiveFeedback(item.id);
                          setIsAddingNewFeedback(true);
                        }}
                        className="flex items-center gap-2 text-navbar hover:text-opacity-80 transition-colors"
                        type="button"
                      >
                        <PlusCircle size={20} />
                        <span>Add Feedback</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredFeedback.length === 0 && (
            <div className="text-center py-8">
              <ThumbsUp size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No teachers found to provide feedback</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;