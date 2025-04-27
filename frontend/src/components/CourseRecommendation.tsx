import React, { useEffect, useState } from 'react';
import { getStudentScores, CourseScore } from '../services/courseScoreService';
import { coursesData, Course } from '../pages/student/coursesData';

interface CourseRecommendationProps {
  studentEmail: string;
}

const CourseRecommendation: React.FC<CourseRecommendationProps> = ({ studentEmail }) => {
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await getStudentScores(studentEmail);
        generateRecommendations(data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          // No scores yet, not an error
          generateRecommendations([]);
        } else {
          setError('Failed to load course scores');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [studentEmail]);

  const generateRecommendations = (courseScores: CourseScore[]) => {
    // Extract completed courses and their subjects
    const completedCourseIds = new Set(courseScores.map(score => score.courseId));
    
    const coursesBySubject: Record<string, Course[]> = {};
    
    // Group all available courses by subject
    Object.values(coursesData).forEach(course => {
      if (!coursesBySubject[course.subject]) {
        coursesBySubject[course.subject] = [];
      }
      coursesBySubject[course.subject].push(course);
    });
    
    // Find subjects the student has engaged with
    const studentSubjects = new Set<string>();
    courseScores.forEach(score => {
      const course = coursesData[score.courseId];
      if (course) {
        studentSubjects.add(course.subject);
      }
    });
    
    // Create recommendations based on:
    // 1. Same subjects the student is already studying, but more advanced courses
    // 2. Popular courses from other subjects
    
    const recommendations: Course[] = [];
    
    // Add courses from same subjects that student hasn't completed
    studentSubjects.forEach(subject => {
      const subjectCourses = coursesBySubject[subject] || [];
      const notCompletedCourses = subjectCourses.filter(
        course => !completedCourseIds.has(course.id)
      );
      
      // Sort by rating to recommend the highest rated
      notCompletedCourses.sort((a, b) => b.rating - a.rating);
      
      // Add top 2 from each subject
      recommendations.push(...notCompletedCourses.slice(0, 2));
    });
    
    // If we need more recommendations, add popular courses from other subjects
    if (recommendations.length < 4) {
      const otherSubjects = Object.keys(coursesBySubject).filter(
        subject => !studentSubjects.has(subject)
      );
      
      const additionalRecommendations: Course[] = [];
      
      otherSubjects.forEach(subject => {
        const subjectCourses = coursesBySubject[subject] || [];
        
        // Get beginner courses from other subjects
        const beginnerCourses = subjectCourses.filter(course => 
          course.title.toLowerCase().includes('beginner') || 
          course.title.toLowerCase().includes('introduction')
        );
        
        // Sort by rating and popularity
        beginnerCourses.sort((a, b) => 
          (b.rating * 0.7 + b.studentsEnrolled / 1000 * 0.3) - 
          (a.rating * 0.7 + a.studentsEnrolled / 1000 * 0.3)
        );
        
        additionalRecommendations.push(...beginnerCourses.slice(0, 1));
      });
      
      // Add top rated courses from other subjects
      recommendations.push(
        ...additionalRecommendations.slice(0, 4 - recommendations.length)
      );
    }
    
    setRecommendedCourses(recommendations.slice(0, 4));
  };

  if (loading) {
    return <div className="text-center p-4">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  if (recommendedCourses.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Recommended Courses</h2>
        <p className="text-gray-500">Complete more courses to get personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Courses You Might Like</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendedCourses.map(course => (
          <div key={course.id} className="border rounded-md p-3 hover:bg-gray-50">
            <h3 className="font-medium text-text-primary">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.subject}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm">{course.rating.toFixed(1)}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-600">{course.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendation; 