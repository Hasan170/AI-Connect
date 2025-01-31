import React, { useState } from 'react';
import { Star, MessageSquare, Search, Filter, ThumbsUp, Send } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

interface FeedbackItem {
  id: string;
  teacherName: string;
  subject: string;
  date: string;
  rating?: number;
  feedback?: string;
  status: 'pending' | 'submitted';
}

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const feedbackItems: FeedbackItem[] = [
    {
      id: '1',
      teacherName: 'Dr. Smith',
      subject: 'Mathematics',
      date: '2025-02-01',
      status: 'pending'
    },
    {
      id: '2',
      teacherName: 'Prof. Johnson',
      subject: 'Physics',
      date: '2025-02-02',
      rating: 5,
      feedback: 'Excellent teaching methods and very patient in explaining concepts.',
      status: 'submitted'
    },
    {
      id: '3',
      teacherName: 'Dr. Williams',
      subject: 'Chemistry',
      date: '2025-02-03',
      status: 'pending'
    }
  ];

  const filteredFeedback = feedbackItems.filter(item => {
    const matchesSearch = 
      item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmitFeedback = (id: string) => {
    console.log('Submitting feedback:', {
      id,
      rating: selectedRating,
      feedback: feedbackText
    });
    setActiveFeedback(null);
    setFeedbackText('');
    setSelectedRating(0);
  };

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => {}} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Feedback</h1>
            <p className="text-text-secondary mt-2">Share your experience and help us improve</p>
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
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-6">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{item.subject}</h3>
                    <p className="text-gray-500">{item.teacherName}</p>
                    <p className="text-sm text-gray-500">Class Date: {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    item.status === 'submitted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                {item.status === 'submitted' ? (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={20}
                          className={index < (item.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{item.feedback}</p>
                  </div>
                ) : activeFeedback === item.id ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedRating(index + 1)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={index < selectedRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveFeedback(null)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitFeedback(item.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        <Send size={16} />
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveFeedback(item.id)}
                    className="mt-4 flex items-center gap-2 text-navbar hover:text-opacity-80 transition-colors"
                  >
                    <MessageSquare size={20} />
                    <span>Give Feedback</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredFeedback.length === 0 && (
            <div className="text-center py-8">
              <ThumbsUp size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No feedback requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;