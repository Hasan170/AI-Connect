import axios from 'axios';
import { Course } from '../../frontend/src/pages/student/coursesData';

// Backend API URL
const API_URL = 'http://localhost:5001/api/courses/score';

// Ultra-simplified recommendation system
export const getRecommendedCourses = async (
  studentEmail: string,
  availableCourses: Course[]
): Promise<Course[]> => {
  try {
    console.log(`Starting ultra-simplified recommendation process for ${studentEmail}`);
    
    // Filter out courses with progress and ID 3
    const availableForRecommendation = availableCourses.filter(
      course => !course.progress && course.id !== '3'
    );
    
    console.log(`Found ${availableForRecommendation.length} courses available for recommendation`);
    
    // Try to get scores
    let scores = [];
    try {
      const response = await axios.get(`${API_URL}/student/${studentEmail}`);
      scores = response.data || [];
      console.log(`Found ${scores.length} scores in database`);
    } catch (error) {
      console.log("Error fetching scores, will use default recommendations:", error);
    }
    
    // If we have scores, return up to 3 courses
    if (scores && scores.length > 0) {
      // Just grab up to 3 courses that aren't in progress
      const recommendations = availableForRecommendation.slice(0, 3);
      
      if (recommendations.length > 0) {
        console.log("Returning simple recommendations:");
        recommendations.forEach(course => {
          console.log(`- ${course.title} (ID: ${course.id})`);
        });
        return recommendations;
      }
    }
    
    // If we don't have scores or couldn't find recommendations,
    // return the "no score data" flag
    console.log("No suitable recommendations found, returning noScoreData flag");
    return [{ noScoreData: true } as any];
  } catch (error) {
    console.error("Error in recommendation process:", error);
    return [{ noScoreData: true, error: "Error generating recommendations" } as any];
  }
}; 