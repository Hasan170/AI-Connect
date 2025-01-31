import React, { useState } from 'react';
import { Search, Filter, File, Video, Book, Download, Eye, Clock, Star, FileText, Youtube } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: 'note' | 'video' | 'book';
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  views: number;
  rating: number;
  size: string;
  url: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'note' | 'video' | 'book'>('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Calculus Fundamentals Notes',
      subject: 'Mathematics',
      type: 'note',
      uploadedBy: 'Dr. Smith',
      uploadDate: '2024-02-01',
      downloads: 128,
      views: 256,
      rating: 4.8,
      size: '2.5 MB',
      url: '/resources/calculus-notes.pdf'
    },
    {
      id: '2',
      title: 'Quantum Physics Video Lecture',
      subject: 'Physics',
      type: 'video',
      uploadedBy: 'Prof. Johnson',
      uploadDate: '2024-02-02',
      downloads: 89,
      views: 312,
      rating: 4.9,
      size: '450 MB',
      url: '/resources/quantum-lecture.mp4'
    },
    {
      id: '3',
      title: 'Organic Chemistry Textbook',
      subject: 'Chemistry',
      type: 'book',
      uploadedBy: 'Dr. Williams',
      uploadDate: '2024-02-03',
      downloads: 156,
      views: 423,
      rating: 4.7,
      size: '15 MB',
      url: '/resources/chemistry-book.pdf'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText size={20} className="text-blue-500" />;
      case 'video':
        return <Youtube size={20} className="text-red-500" />;
      case 'book':
        return <Book size={20} className="text-green-500" />;
      default:
        return <File size={20} />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || resource.subject === filterSubject;
    const matchesType = activeTab === 'all' || resource.type === activeTab;
    return matchesSearch && matchesSubject && matchesType;
  });

  const tabs = [
    { id: 'all', label: 'All Resources', icon: <File size={20} /> },
    { id: 'note', label: 'Notes', icon: <FileText size={20} /> },
    { id: 'video', label: 'Videos', icon: <Youtube size={20} /> },
    { id: 'book', label: 'Books', icon: <Book size={20} /> }
  ];

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={() => {}} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Resources</h1>
            <p className="text-text-secondary mt-2">Access study materials shared by your teachers</p>
          </div>

          {/* Tabs */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-navbar text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
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
                    placeholder="Search resources..."
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
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resources Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(resource.type)}
                        <div>
                          <div className="font-medium text-gray-900">{resource.title}</div>
                          <div className="text-sm text-gray-500">{resource.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{resource.subject}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{resource.uploadedBy}</div>
                      <div className="text-sm text-gray-500">
                        <Clock size={14} className="inline mr-1" />
                        {new Date(resource.uploadDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          <Eye size={14} className="inline mr-1" />
                          {resource.views}
                        </span>
                        <span>
                          <Download size={14} className="inline mr-1" />
                          {resource.downloads}
                        </span>
                        <span>
                          <Star size={14} className="inline mr-1 text-yellow-400" />
                          {resource.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye size={20} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Download size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;