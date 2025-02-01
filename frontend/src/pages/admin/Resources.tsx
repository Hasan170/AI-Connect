import React from 'react';
import { File, Video, Book, Download, Plus, Search, Filter } from 'lucide-react';
import Sidebar from '../../components/AdminSidebar';

interface Resource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'ebook';
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  size?: string;
  duration?: string;
  downloads: number;
}

const Resources = () => {
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Advanced Mathematics Study Guide',
      type: 'document',
      subject: 'Mathematics',
      uploadedBy: 'Dr. Smith',
      uploadDate: '2024-03-15',
      size: '2.5 MB',
      downloads: 125
    },
    {
      id: '2',
      title: 'Physics Fundamentals Video Series',
      type: 'video',
      subject: 'Physics',
      uploadedBy: 'Prof. Johnson',
      uploadDate: '2024-03-14',
      duration: '45 mins',
      downloads: 89
    },
    {
      id: '3',
      title: 'Chemistry Lab Manual',
      type: 'ebook',
      subject: 'Chemistry',
      uploadedBy: 'Dr. Williams',
      uploadDate: '2024-03-13',
      size: '4.8 MB',
      downloads: 234
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <File className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'ebook':
        return <Book className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-3xl font-bold text-text-primary">Resources</h1>
            <p className="text-text-secondary mt-2">Manage and organize educational materials</p>
          </div>

          {/* Actions Bar */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-400" />
                  <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navbar">
                    <option value="all">All Types</option>
                    <option value="document">Documents</option>
                    <option value="video">Videos</option>
                    <option value="ebook">E-Books</option>
                  </select>
                </div>
              </div>
              <button className="bg-navbar text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2">
                <Plus size={20} />
                Add Resource
              </button>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-navbar bg-opacity-10 rounded-lg text-navbar">
                      {getIcon(resource.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{resource.title}</h3>
                      <p className="text-sm text-gray-500">{resource.subject}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Uploaded by</span>
                    <span className="text-text-primary">{resource.uploadedBy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="text-text-primary">{resource.uploadDate}</span>
                  </div>
                  {resource.size && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Size</span>
                      <span className="text-text-primary">{resource.size}</span>
                    </div>
                  )}
                  {resource.duration && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="text-text-primary">{resource.duration}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Downloads</span>
                    <span className="text-text-primary">{resource.downloads}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-navbar bg-opacity-10 text-navbar py-2 rounded-lg hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2">
                  <Download size={18} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;