import React, { useState, useEffect, useRef } from 'react';
import { File, Video, Book, Download, Plus, Search, Filter, Trash2, X } from 'lucide-react';
import Sidebar from '../../components/AdminSidebar';
import api from '../../api';

interface Resource {
  _id: string;
  title: string;
  type: 'document' | 'video' | 'ebook' | 'lab_manual' | 'ppt' | 'notes';
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
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // For upload form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'document',
    subject: '',
    description: '',
    duration: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setError('Failed to load resources');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadForm({ ...uploadForm, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // const handleUpload = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!selectedFile) {
  //     alert('Please select a file to upload');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append('file', selectedFile);
  //     formData.append('title', uploadForm.title);
  //     formData.append('type', uploadForm.type);
  //     formData.append('subject', uploadForm.subject);
  //     formData.append('description', uploadForm.description);

  //     // Get teacher ID from localStorage or use a default
  //     const teacherEmail = localStorage.getItem('teacherEmail');
  //     if (teacherEmail) {
  //       const teacherResponse = await api.get(`/teacher/details/${teacherEmail}`);
  //       formData.append('uploadedById', teacherResponse.data._id);
  //       formData.append('uploadedByName', teacherResponse.data.name);
  //     } else {
  //       // For demo purposes, you might use a default ID
  //       formData.append('uploadedById', '60d0fe4f5311236168a109ca');
  //       formData.append('uploadedByName', 'Admin User');
  //     }

  //     // If it's a video, you might want to include duration
  //     if (uploadForm.type === 'video' && uploadForm.duration) {
  //       formData.append('duration', uploadForm.duration);
  //     }

  //     const response = await api.post('/resources/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         const percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / (progressEvent.total || 1)
  //         );
  //         setUploadProgress(percentCompleted);
  //       }
  //     });

  //     // Reset the form and close modal
  //     setUploadForm({
  //       title: '',
  //       type: 'document',
  //       subject: '',
  //       description: ''
  //     });
  //     setSelectedFile(null);
  //     setUploadProgress(0);
  //     setIsModalOpen(false);
      
  //     // Refresh the resources list
  //     fetchResources();
      
  //   } catch (err) {
  //     console.error('Upload error:', err);
  //     alert('Failed to upload resource');
  //   }
  // };

const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedFile) {
    alert('Please select a file to upload');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', uploadForm.title);
    formData.append('type', uploadForm.type);
    formData.append('subject', uploadForm.subject);
    formData.append('description', uploadForm.description);

    // Simplify teacher info handling - just use email and name directly
    const teacherEmail = localStorage.getItem('teacherEmail') || 'admin@example.com';
    const teacherName = localStorage.getItem('userName') || 'Admin User';
    
    formData.append('uploadedById', teacherEmail);
    formData.append('uploadedByName', teacherName);

    if (uploadForm.type === 'video' && uploadForm.duration) {
      formData.append('duration', uploadForm.duration);
    }

    const response = await api.post('/resources/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        setUploadProgress(percentCompleted);
      }
    });

    // Reset form and refresh resources
    setUploadForm({
      title: '',
      type: 'document',
      subject: '',
      description: '',
      duration: ''
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setIsModalOpen(false);
    fetchResources();
    
  } catch (err) {
    console.error('Upload error:', err);
    alert('Failed to upload resource');
  }
};

  

  const handleDeleteResource = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/resources/${id}`);
        setResources(resources.filter(resource => resource._id !== id));
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete resource');
      }
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
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
      case 'notes':
      case 'ppt':
        return <File className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'ebook':
      case 'lab_manual':
      case 'book':
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-400" />
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navbar"
                  >
                    <option value="all">All Types</option>
                    <option value="document">Documents</option>
                    <option value="video">Videos</option>
                    <option value="ebook">E-Books</option>
                    <option value="lab_manual">Lab Manuals</option>
                    <option value="ppt">Presentations</option>
                    <option value="notes">Notes</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-navbar text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Resource
              </button>
            </div>
          </div>

          {/* Resources Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navbar"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center text-gray-500 p-4">No resources found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div key={resource._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 relative">
                  <button
                    onClick={() => handleDeleteResource(resource._id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
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
                      <span className="text-text-primary">{resource.uploadedBy?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="text-text-primary">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Size</span>
                      <span className="text-text-primary">{formatFileSize(resource.fileSize)}</span>
                    </div>
                    {resource.duration && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="text-text-primary">{resource.duration}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Downloads</span>
                      <span className="text-text-primary">{resource.downloadCount}</span>
                    </div>
                  </div>
                  <a 
                    href={`${import.meta.env.VITE_API_URL}/uploads/${resource.fileName}`}
                    target="_blank"
                    className="w-full mt-4 bg-navbar bg-opacity-10 text-navbar py-2 rounded-lg hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload New Resource</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={uploadForm.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={uploadForm.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="ebook">E-Book</option>
                  <option value="lab_manual">Lab Manual</option>
                  <option value="ppt">Presentation</option>
                  <option value="notes">Notes</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={uploadForm.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={uploadForm.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              {uploadForm.type === 'video' && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Duration (e.g., "45m" or "1h 20m")
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={uploadForm.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  File
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full"
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              
              {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-navbar h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{uploadProgress}% Uploaded</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-navbar text-white rounded-lg hover:bg-opacity-90"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;