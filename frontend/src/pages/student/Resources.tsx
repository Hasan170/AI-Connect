import React, { useState, useEffect } from 'react';
import { Search, Filter, File, Video, Book, Download, Eye, Clock, Star, FileText, Youtube } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import api from '../../api';

interface Resource {
  _id: string;
  title: string;
  type: string;
  subject: string;
  uploadedBy: {
    _id: string;
    name: string;
  };
  fileName: string;
  fileSize: number;
  duration?: string;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  description?: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'document' | 'video' | 'book' | 'lab_manual' | 'ppt' | 'notes'>('all');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resources');
      setResources(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
      setLoading(false);
    }
  };

  const handleResourceView = async (resource: Resource) => {
    try {
      // Increment view count in the backend
      await api.put(`/resources/${resource._id}/view`);
      
      // Update local state
      setResources(resources.map(r => 
        r._id === resource._id ? { ...r, viewCount: r.viewCount + 1 } : r
      ));
      
      // Open resource in a new tab or modal
      setViewingResource(resource);
      
      // If it's a file, open it in a new tab
      if (resource.fileName) {
        window.open(`${import.meta.env.VITE_API_URL}/uploads/${resource.fileName}`, '_blank');
      }
    } catch (err) {
      console.error('Error viewing resource:', err);
    }
  };

  const handleResourceDownload = async (resource: Resource) => {
    try {
      // Increment download count in the backend
      await api.put(`/resources/${resource._id}/download`);
      
      // Update local state
      setResources(resources.map(r => 
        r._id === resource._id ? { ...r, downloadCount: r.downloadCount + 1 } : r
      ));
      
      // Trigger file download
      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_API_URL}/uploads/${resource.fileName}`;
      link.download = resource.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading resource:', err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
      case 'notes':
        return <FileText size={20} className="text-blue-500" />;
      case 'video':
        return <Youtube size={20} className="text-red-500" />;
      case 'book':
      case 'ebook':
      case 'lab_manual':
        return <Book size={20} className="text-green-500" />;
      case 'ppt':
        return <File size={20} className="text-orange-500" />;
      default:
        return <File size={20} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || resource.subject === filterSubject;
    const matchesType = activeTab === 'all' || resource.type === activeTab;
    return matchesSearch && matchesSubject && matchesType;
  });

  // Get unique subjects from resources
  const subjects = ['all', ...new Set(resources.map(r => r.subject))];

  const tabs = [
    { id: 'all', label: 'All Resources', icon: <File size={20} /> },
    { id: 'document', label: 'Documents', icon: <FileText size={20} /> },
    { id: 'video', label: 'Videos', icon: <Youtube size={20} /> },
    { id: 'book', label: 'Books', icon: <Book size={20} /> },
    { id: 'lab_manual', label: 'Lab Manuals', icon: <Book size={20} /> },
    { id: 'ppt', label: 'Presentations', icon: <File size={20} /> },
    { id: 'notes', label: 'Notes', icon: <FileText size={20} /> }
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
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
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
                  {subjects.slice(1).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resources Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navbar"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center text-gray-500 p-8">No resources found</div>
            ) : (
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
                    <tr key={resource._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(resource.type)}
                          <div>
                            <div className="font-medium text-gray-900">{resource.title}</div>
                            <div className="text-sm text-gray-500">{formatFileSize(resource.fileSize)}</div>
                            {resource.duration && (
                              <div className="text-sm text-gray-500">{resource.duration}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{resource.subject}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{resource.uploadedBy?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">
                          <Clock size={14} className="inline mr-1" />
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            <Eye size={14} className="inline mr-1" />
                            {resource.viewCount}
                          </span>
                          <span>
                            <Download size={14} className="inline mr-1" />
                            {resource.downloadCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleResourceView(resource)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye size={20} />
                          </button>
                          <button 
                            onClick={() => handleResourceDownload(resource)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;