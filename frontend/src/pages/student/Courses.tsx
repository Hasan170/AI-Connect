import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Star, Users } from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import { Course, coursesData } from './coursesData';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  
  // Filter for enrolled courses (courses with progress)
  const enrolledCourses = Object.values(coursesData).filter(course => course.progress !== undefined);
  
  // Filter for recommended courses (courses without progress)
  const recommendedCourses = Object.values(coursesData).filter(course => course.progress === undefined);

  const handleNotebookClick = () => {
    // Handle notebook click
    console.log("Notebook clicked");
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/student/MyCourses/${courseId}`);
  };

  // Card component for both enrolled and recommended courses
  const CourseCard = ({ course, enrolled = false }: { course: Course, enrolled?: boolean }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handleCourseClick(course.id)}
    >
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
              <span className="text-sm text-gray-500">Based on your learning history</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;