import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Star, Users, AlertCircle, Info, RefreshCw } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import { Course, coursesData } from './coursesData';
import { getRecommendedCourses } from '../../../../backend/services/courseRecommendationService';
import AIRecommendationBadge from '../../components/AIRecommendationBadge';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noScoreData, setNoScoreData] = useState(false);
  const [noScoreMessage, setNoScoreMessage] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  
  // Filter for enrolled courses (courses with progress)
  const enrolledCourses = Object.values(coursesData).filter(course => course.progress !== undefined);
  
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoScoreMessage(null);
      
      // Get the current user's email from localStorage
      const currentUserStr = localStorage.getItem('currentUser');
      const userEmail = localStorage.getItem('userEmail') || 
                       localStorage.getItem('studentEmail');
      
      let email = '';
      
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          email = currentUser.email;
        } catch (e) {
          console.error('Error parsing currentUser:', e);
        }
      }
      
      // Fall back to userEmail or studentEmail if currentUser parsing failed
      if (!email && userEmail) {
        email = userEmail;
      }
      
      if (!email) {
        throw new Error('User email not found, please log in again');
      }
      
      setCurrentUserEmail(email);
      console.log('Fetching recommendations for student:', email);
      
      // Get quiz-based recommendations
      const recommended = await getRecommendedCourses(
        email, 
        Object.values(coursesData)
      );
      
      // Check if we have noScoreData flag
      if (recommended.length > 0 && 'noScoreData' in recommended[0]) {
        setNoScoreData(true);
        
        // Check if there's a specific message
        if ('message' in recommended[0]) {
          setNoScoreMessage(recommended[0].message as string);
        }
        
        // Set empty recommendations since we have no scores
        setRecommendedCourses([]);
      } else {
        // We have valid recommendations
        setNoScoreData(false);
        setRecommendedCourses(recommended);
      }
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
      setRecommendedCourses([]);
      setNoScoreData(true);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleNotebookClick = () => {
    // Handle notebook click
    console.log("Notebook clicked");
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/student/MyCourses/${courseId}`);
  };
  
  const handleRefreshRecommendations = () => {
    fetchRecommendations();
  };

  // Card component for both enrolled and recommended courses
  const CourseCard = ({ course, enrolled = false, isRecommended = false }: 
    { course: Course, enrolled?: boolean, isRecommended?: boolean }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative group"
      onClick={() => handleCourseClick(course.id)}
    >
      {isRecommended && !noScoreData && (
        <div className="absolute top-2 right-2 z-10">
          <AIRecommendationBadge />
        </div>
      )}
      <div className="h-40 bg-gray-300 relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {enrolled && course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs py-1 px-3">
            <div className="w-full bg-gray-500 rounded-full h-1.5 mb-1">
              <div 
                className="bg-white rounded-full h-1.5" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span>{course.progress}% complete</span>
              {course.completedModules && (
                <span>{course.completedModules}/{course.totalModules} modules</span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-text-primary">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{course.subject}</p>
        <p className="text-sm text-gray-700 mb-3">Instructor: {course.instructor}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users size={14} />
            <span>{course.studentsEnrolled.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-current" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={handleNotebookClick} />
      <div className="flex-1 pt-24 px-6 pb-10 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* My Courses Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-text-primary">My Courses</h1>
              {/* <Link 
                to="/student/browse-courses" 
                className="text-navbar hover:text-button-secondary font-medium"
              >
                Browse All Courses
              </Link> */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {enrolledCourses.map(course => (
                <CourseCard key={course.id} course={course} enrolled={true} />
              ))}
            </div>
          </div>
          
          {/* Recommended Courses Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Recommended Courses</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {noScoreData ? 'Based on your course activity' : 'Personalized recommendations based on your quiz scores'}
                </span>
                <button 
                  onClick={handleRefreshRecommendations}
                  className="flex items-center gap-1 px-3 py-1 bg-navbar text-white rounded-md hover:bg-navbar-dark text-sm transition-colors"
                  disabled={loading}
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            {currentUserEmail && (
              <div className="bg-gray-100 rounded-md p-2 mb-4 text-sm text-gray-600">
                Getting recommendations for: {currentUserEmail}
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navbar"></div>
                <span className="ml-3 text-gray-600">Loading recommendations...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle size={18} className="text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            ) : noScoreData ? (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <div className="flex items-center">
                  <Info size={18} className="text-blue-500 mr-2" />
                  <p className="text-blue-700 text-sm">
                    {noScoreMessage || 
                     "Complete quizzes in your courses to get personalized recommendations based on your performance! Try some courses that interest you to help us build your learning path."}
                  </p>
                </div>
              </div>
            ) : null}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map(course => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    isRecommended={true}
                  />
                ))
              ) : noScoreData ? (
                <div className="col-span-full text-center py-6 text-gray-500">
                  No course recommendations available yet. Complete some course quizzes to get personalized recommendations.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;