import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayCircle, 
  FileText, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Award, 
  MessageSquare, 
  Download,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Users,
  Star
} from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import api from '../../api';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: string;
  completed: boolean;
  url?: string;
}

interface Course {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  totalHours: number;
  rating: number;
  studentsEnrolled: number;
  modules: Module[];
}

const MyCourses: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'overview' | 'discussion' | 'notes'>('content');
  
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the course from your backend
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const mockCourse: Course = {
            id: '1',
            title: 'Advanced Mathematics',
            subject: 'Mathematics',
            instructor: 'Dr. Ahmed',
            thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
            progress: 35,
            totalModules: 8,
            completedModules: 3,
            totalHours: 24,
            rating: 4.8,
            studentsEnrolled: 1250,
            modules: [
              {
                id: 'm1',
                title: 'Module 1: Introduction to Calculus',
                description: 'The basics of differential calculus and its applications.',
                duration: '3h 20m',
                completed: true,
                lectures: [
                  {
                    id: 'l1',
                    title: 'Introduction to the Course',
                    type: 'video',
                    duration: '10m',
                    completed: true,
                    url: 'https://www.youtube.com/embed/WUvTyaaNkzM'
                  },
                  {
                    id: 'l2',
                    title: 'What is Calculus?',
                    type: 'video',
                    duration: '20m',
                    completed: true,
                    url: 'https://www.youtube.com/embed/HfACrKJ_Y2w'
                  },
                  {
                    id: 'l3',
                    title: 'Limits and Continuity',
                    type: 'reading',
                    duration: '30m',
                    completed: true
                  },
                  {
                    id: 'l4',
                    title: 'Module 1 Quiz',
                    type: 'quiz',
                    duration: '20m',
                    completed: true
                  }
                ]
              },
              {
                id: 'm2',
                title: 'Module 2: Derivatives',
                description: 'Understanding derivatives and their properties.',
                duration: '4h 45m',
                completed: true,
                lectures: [
                  {
                    id: 'l5',
                    title: 'Definition of the Derivative',
                    type: 'video',
                    duration: '25m',
                    completed: true,
                    url: 'https://www.youtube.com/embed/rAof9Ld5sOg'
                  },
                  {
                    id: 'l6',
                    title: 'Rules of Differentiation',
                    type: 'video',
                    duration: '30m',
                    completed: true,
                    url: 'https://www.youtube.com/embed/O8xoEKvE-MU'
                  },
                  {
                    id: 'l7',
                    title: 'Applications of Derivatives',
                    type: 'reading',
                    duration: '40m',
                    completed: true
                  },
                  {
                    id: 'l8',
                    title: 'Derivative Problem Set',
                    type: 'assignment',
                    duration: '1h',
                    completed: true
                  }
                ]
              },
              {
                id: 'm3',
                title: 'Module 3: Integrals',
                description: 'Introduction to integration and the fundamental theorem of calculus.',
                duration: '5h 10m',
                completed: true,
                lectures: [
                  {
                    id: 'l9',
                    title: 'Introduction to Integrals',
                    type: 'video',
                    duration: '28m',
                    completed: true,
                    url: 'https://www.youtube.com/embed/rfG8ce4nNh0'
                  },
                  {
                    id: 'l10',
                    title: 'Indefinite Integrals',
                    type: 'video',
                    duration: '32m',
                    completed: true,
                    url: 'https://www.youtube.com/embed/q87L9R9v274'
                  },
                  {
                    id: 'l11',
                    title: 'Definite Integrals',
                    type: 'video',
                    duration: '35m',
                    completed: false,
                    url: 'https://www.youtube.com/embed/1RLctDS2hUQ'
                  },
                  {
                    id: 'l12',
                    title: 'Integration Techniques',
                    type: 'reading',
                    duration: '45m',
                    completed: false
                  },
                  {
                    id: 'l13',
                    title: 'Module 3 Assignment',
                    type: 'assignment',
                    duration: '1h 30m',
                    completed: false
                  }
                ]
              },
              {
                id: 'm4',
                title: 'Module 4: Applications of Integration',
                description: 'Real-world applications of integrals.',
                duration: '4h 30m',
                completed: false,
                lectures: [
                  {
                    id: 'l14',
                    title: 'Area Between Curves',
                    type: 'video',
                    duration: '25m',
                    completed: false,
                    url: 'https://www.youtube.com/embed/WLHgWwNlZHk'
                  },
                  {
                    id: 'l15',
                    title: 'Volume of Solids of Revolution',
                    type: 'video',
                    duration: '30m',
                    completed: false,
                    url: 'https://www.youtube.com/embed/QL0btScXXwI'
                  },
                  {
                    id: 'l16',
                    title: 'Applications in Physics',
                    type: 'reading',
                    duration: '40m',
                    completed: false
                  },
                  {
                    id: 'l17',
                    title: 'Module 4a Quiz',
                    type: 'quiz',
                    duration: '20m',
                    completed: false
                  },
                  {
                    id: 'l18',
                    title: 'Module 4b Quiz',
                    type: 'quiz',
                    duration: '20m',
                    completed: false
                  }
                ]
              }
            ]
          };
          
          setCourse(mockCourse);
          
          // Automatically expand the first incomplete module
          const firstIncompleteModule = mockCourse.modules.find(module => !module.completed);
          if (firstIncompleteModule) {
            setExpandedModules(prev => ({
              ...prev,
              [firstIncompleteModule.id]: true
            }));
          }
          
          setLoading(false);
        }, 800);
      } catch (error) {
        setError('Failed to load course data');
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId]);
  
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  const handleLectureClick = (lecture: Lecture) => {
    if (lecture.type === 'video' && lecture.url) {
      setCurrentVideo(lecture.url);
    }
    
    // In a real app, you would update the completion status on the server
    if (!lecture.completed) {
      if (course) {
        const updatedModules = course.modules.map(module => ({
          ...module,
          lectures: module.lectures.map(l => 
            l.id === lecture.id ? { ...l, completed: true } : l
          )
        }));
        
        setCourse({
          ...course,
          modules: updatedModules
        });
      }
    }
  };
  
  const getLectureIcon = (type: string) => {
    switch(type) {
      case 'video':
        return <PlayCircle className="text-navbar" size={18} />;
      case 'reading':
        return <FileText className="text-green-600" size={18} />;
      case 'quiz':
        return <BookOpen className="text-purple-600" size={18} />;
      case 'assignment':
        return <FileText className="text-orange-500" size={18} />;
      default:
        return <PlayCircle className="text-navbar" size={18} />;
    }
  };
  
  const getCompletionStatus = (completed: boolean) => {
    return completed ? (
      <span className="flex items-center text-green-600">
        <CheckCircle size={16} className="mr-1" /> Completed
      </span>
    ) : (
      <span className="flex items-center text-gray-500">
        <Clock size={16} className="mr-1" /> Pending
      </span>
    );
  };
  
  if (loading) {
    return (
      <div className="flex">
        <StudentSidebar />
        <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navbar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="flex">
        <StudentSidebar />
        <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500 text-center">
                <p className="text-xl mb-2">Error loading course</p>
                <p>{error || 'Course not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Course Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Link to="/student/courses" className="text-navbar hover:text-button-secondary flex items-center">
                <ArrowLeft size={20} className="mr-2" />
                Back to My Courses
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-text-primary mb-2">{course.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    {course.subject}
                  </span>
                  <span className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {course.studentsEnrolled.toLocaleString()} students
                  </span>
                  <span className="flex items-center">
                    <Star size={16} className="mr-1 text-yellow-500 fill-current" />
                    {course.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  Instructor: <span className="font-medium">{course.instructor}</span>
                </p>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {course.totalHours} hours
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {course.totalModules} modules
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-text-primary mb-2">Your Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-navbar rounded-full h-4" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{course.progress}% complete</span>
                    <span>{course.completedModules}/{course.totalModules} modules</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Content Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'content' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('content')}
              >
                Course Content
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'discussion' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('discussion')}
              >
                Discussion
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'notes' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('notes')}
              >
                My Notes
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <p className="text-sm text-gray-600">{course.totalModules} modules • {course.totalHours} hours</p>
                </div>
                
                <div className="divide-y">
                  {course.modules.map((module) => (
                    <div key={module.id} className="transition-all duration-300">
                      <div 
                        className={`p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${expandedModules[module.id] ? 'bg-gray-50' : ''}`}
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary mb-1">{module.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {module.duration}
                            </span>
                            <span className="flex items-center">
                              <PlayCircle size={14} className="mr-1" />
                              {module.lectures.length} lectures
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {module.completed && (
                            <span className="text-green-600">
                              <CheckCircle size={18} />
                            </span>
                          )}
                          {expandedModules[module.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                      
                      {expandedModules[module.id] && (
                        <div className="bg-gray-50 border-t">
                          <div className="p-4 text-sm text-gray-700 mb-2">
                            {module.description}
                          </div>
                          <ul className="divide-y divide-gray-100">
                            {module.lectures.map((lecture) => (
                              <li 
                                key={lecture.id} 
                                className={`p-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${currentVideo === lecture.url ? 'bg-blue-50' : ''}`}
                                onClick={() => handleLectureClick(lecture)}
                              >
                                <div className="flex items-center">
                                  {getLectureIcon(lecture.type)}
                                  <span className="ml-3">{lecture.title}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="text-gray-500">{lecture.duration}</span>
                                  {lecture.completed && <CheckCircle size={16} className="text-green-600" />}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Video Player and Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {activeTab === 'content' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {currentVideo ? (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe 
                        src={currentVideo} 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <PlayCircle size={48} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">Select a video lecture to start learning</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium mb-2 flex items-center">
                          <FileText size={18} className="mr-2 text-navbar" />
                          Course Textbook
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">Complete course textbook with all formulas and examples.</p>
                        <button className="text-navbar hover:text-button-secondary text-sm flex items-center">
                          <Download size={14} className="mr-1" />
                          Download PDF
                        </button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium mb-2 flex items-center">
                          <FileText size={18} className="mr-2 text-navbar" />
                          Formula Sheet
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">Quick reference to all important formulas in the course.</p>
                        <button className="text-navbar hover:text-button-secondary text-sm flex items-center">
                          <Download size={14} className="mr-1" />
                          Download PDF
                        </button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium mb-2 flex items-center">
                          <FileText size={18} className="mr-2 text-navbar" />
                          Practice Problems
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">Additional practice problems with solutions.</p>
                        <button className="text-navbar hover:text-button-secondary text-sm flex items-center">
                          <Download size={14} className="mr-1" />
                          Download PDF
                        </button>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium mb-2 flex items-center">
                          <FileText size={18} className="mr-2 text-navbar" />
                          Lecture Slides
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">Slides used in the video lectures.</p>
                        <button className="text-navbar hover:text-button-secondary text-sm flex items-center">
                          <Download size={14} className="mr-1" />
                          Download PPT
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'overview' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">About This Course</h3>
                    <p className="text-gray-700 mb-4">
                      This comprehensive course on Advanced Mathematics covers calculus fundamentals, including differentiation, integration, and their applications. By the end of this course, you'll be able to solve complex mathematical problems and apply these concepts to real-world scenarios.
                    </p>
                    <p className="text-gray-700">
                      The course is designed for high school students preparing for college-level mathematics or anyone interested in deepening their understanding of calculus.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5" />
                        <span>Understand limits and continuity</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5" />
                        <span>Master differentiation techniques</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5" />
                        <span>Apply derivatives to real-world problems</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5" />
                        <span>Calculate integrals using various methods</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5" />
                        <span>Solve area and volume problems</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5" />
                        <span>Apply calculus to physics and engineering</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5" />
                        <span>Analyze functions using calculus</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-0.5" />
                        <span>Understand the Fundamental Theorem of Calculus</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Basic algebra and trigonometry</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Understanding of functions and their graphs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Familiarity with the concept of limits (helpful but not required)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Instructor</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-navbar text-white flex items-center justify-center">
                        <Users size={24} />
                      </div>
                      <div>
                        <h4 className="font-medium">{course.instructor}</h4>
                        <p className="text-sm text-gray-600">Professor of Mathematics</p>
                        <p className="text-sm text-gray-600">Ph.D. in Applied Mathematics</p>
                        <div className="flex items-center mt-1">
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <Star size={16} className="text-yellow-500 fill-current" />
                          <span className="ml-1 text-sm">(4.9)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'discussion' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Discussion Forum</h2>
                    <button className="bg-navbar text-white px-4 py-2 rounded-lg hover:bg-button-secondary transition-colors">
                      New Post
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search discussions..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navbar"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Discussion Thread */}
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Help with Problem 3.4</h3>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        I'm having trouble understanding how to solve the integral in problem 3.4. Can someone explain the steps?
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          <span className="mr-3">Jane Smith</span>
                          <MessageSquare size={14} className="mr-1" />
                          <span>5 replies</span>
                        </div>
                        <button className="text-navbar hover:text-button-secondary text-sm">
                          View Thread
                        </button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Derivative of ln(x) explanation</h3>
                        <span className="text-sm text-gray-500">5 days ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        Can someone provide a more intuitive explanation for why the derivative of ln(x) is 1/x? I understand the proof, but I'm looking for a more conceptual understanding.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          <span className="mr-3">Michael Johnson</span>
                          <MessageSquare size={14} className="mr-1" />
                          <span>8 replies</span>
                        </div>
                        <button className="text-navbar hover:text-button-secondary text-sm">
                          View Thread
                        </button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Integration technique question</h3>
                        <span className="text-sm text-gray-500">1 week ago</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        When should I use substitution vs. integration by parts? I'm having trouble deciding which technique to apply for different problems.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          <span className="mr-3">David Wilson</span>
                          <MessageSquare size={14} className="mr-1" />
                          <span>12 replies</span>
                        </div>
                        <button className="text-navbar hover:text-button-secondary text-sm">
                          View Thread
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-center mt-6">
                      <button className="text-navbar hover:text-button-secondary font-medium">
                        Load More Discussions
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notes' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">My Notes</h2>
                    <button className="bg-navbar text-white px-4 py-2 rounded-lg hover:bg-button-secondary transition-colors">
                      Add New Note
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Lecture 2.1 Notes</h3>
                        <div className="flex gap-2">
                          <button className="text-gray-500 hover:text-navbar">
                            <FileText size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-navbar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Important points on derivatives:
                        <br />
                        - The derivative of a constant is 0
                        <br />
                        - Power rule: d/dx(x^n) = n*x^(n-1)
                        <br />
                        - Product rule: d/dx(f*g) = f'g + fg'
                      </p>
                      <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                        <span>Last edited: 2 days ago</span>
                        <div className="flex gap-2">
                          <button className="text-navbar hover:text-button-secondary">Edit</button>
                          <button className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Integration Techniques Summary</h3>
                        <div className="flex gap-2">
                          <button className="text-gray-500 hover:text-navbar">
                            <FileText size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-navbar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Integration methods:
                        <br />
                        1. Direct integration (antiderivatives)
                        <br />
                        2. Substitution method (u-substitution)
                        <br />
                        3. Integration by parts: ∫u·dv = u·v - ∫v·du
                        <br />
                        4. Partial fractions for rational functions
                      </p>
                      <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                        <span>Last edited: 1 week ago</span>
                        <div className="flex gap-2">
                          <button className="text-navbar hover:text-button-secondary">Edit</button>
                          <button className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Questions for Next Study Group</h3>
                        <div className="flex gap-2">
                          <button className="text-gray-500 hover:text-navbar">
                            <FileText size={16} />
                          </button>
                          <button className="text-gray-500 hover:text-navbar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Topics to discuss:
                        <br />
                        - Applications of definite integrals
                        <br />
                        - How to approach volume problems
                        <br />
                        - Tips for recognizing which integration technique to use
                      </p>
                      <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
                        <span>Last edited: 3 days ago</span>
                        <div className="flex gap-2">
                          <button className="text-navbar hover:text-button-secondary">Edit</button>
                          <button className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;