import axios from 'axios';
import { Course } from '../pages/student/coursesData';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Backend API URL 
const API_URL = 'http://localhost:5001/api/courses/score';

// Hardcoded API key for testing
const GEMINI_API_KEY = 'AIzaSyBheuPJ1b5-qmh_bMHJ0-XiKdh1RlrZtVI';

console.log("Using API key:", GEMINI_API_KEY);

// Initialize Gemini AI
let genAI: any;
let model: any;

try {
  // Use hardcoded key
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  console.log("Gemini AI initialized successfully with model: gemini-2.0-flash");
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

// Function to extract level from course title
const getCourseLevel = (courseTitle: string): 'beginner' | 'intermediate' | 'advanced' => {
  const lowerTitle = courseTitle.toLowerCase();
  
  if (lowerTitle.includes('beginner') || lowerTitle.includes('beginer')) {
    return 'beginner';
  } else if (lowerTitle.includes('intermediate')) {
    return 'intermediate';
  } else if (lowerTitle.includes('advanced')) {
    return 'advanced';
  }
  
  // Default to beginner if level not found in title
  return 'beginner';
};

// Function to extract course topic (more specific than just subject)
const getCourseTopic = (courseTitle: string): string => {
  // Clean the title for better matching
  const cleanTitle = courseTitle.toLowerCase()
    .replace(/beginner|beginer|intermediate|advanced|[-–—].*$/g, '')
    .trim();
  
  console.log(`Extracting topic from: "${courseTitle}" -> cleaned to: "${cleanTitle}"`);
  
  // FIRST PASS: Try to extract the exact main subject
  // This gives us high confidence matches based on full subject names
  if (/fundamentals of arithmetic|arithmetic basics|arithmetic/i.test(cleanTitle)) {
    return 'Arithmetic';
  }
  if (/introduction to algebra|algebra basics|algebra/i.test(cleanTitle)) {
    return 'Algebra';
  }
  if (/geometry basics|geometry/i.test(cleanTitle)) {
    return 'Geometry';
  }
  if (/calculus/i.test(cleanTitle)) {
    return 'Calculus';
  }
  if (/thermodynamics/i.test(cleanTitle)) {
    return 'Thermodynamics';
  }
  if (/quantum mechanics|quantum/i.test(cleanTitle)) {
    return 'Quantum Physics';
  }
  if (/classical mechanics|mechanics/i.test(cleanTitle)) {
    return 'Mechanics';
  }
  if (/chemistry/i.test(cleanTitle)) {
    return 'Chemistry';
  }
  if (/biology/i.test(cleanTitle)) {
    return 'Biology';
  }
  if (/magnetism/i.test(cleanTitle)) {
    return 'Magnetism';
  }
  
  // SECOND PASS: Look at the first word of the title
  // This is a fallback for simpler course naming patterns
  const firstWord = cleanTitle.split(' ')[0];
  if (firstWord === 'arithmetic') return 'Arithmetic';
  if (firstWord === 'algebra') return 'Algebra';
  if (firstWord === 'geometry') return 'Geometry';
  if (firstWord === 'calculus') return 'Calculus';
  if (firstWord === 'thermodynamics') return 'Thermodynamics';
  if (firstWord === 'quantum') return 'Quantum Physics';
  if (firstWord === 'mechanics') return 'Mechanics';
  if (firstWord === 'chemistry') return 'Chemistry';
  if (firstWord === 'biology') return 'Biology';
  if (firstWord === 'magnetism') return 'Magnetism';
  if (firstWord === 'physics') return 'Physics';
  
  // THIRD PASS: Check if title contains "physics" but not as the first word
  if (cleanTitle.includes('physics')) {
    return 'Physics';
  }
  
  // If we still can't determine the topic, return the cleaned title with first letter capitalized
  return cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
};

// Log topics of all available courses for debugging
const logAllCourseTopics = (courses: Course[]) => {
  console.log("=== DEBUG: All course topics ===");
  courses.forEach(course => {
    const topic = getCourseTopic(course.title);
    const level = getCourseLevel(course.title);
    console.log(`${course.id}: "${course.title}" → Topic: "${topic}", Level: "${level}"`);
  });
  console.log("==============================");
};

// Function to determine next recommended level based on current level and score
const getNextLevel = (currentLevel: string, score: number): 'beginner' | 'intermediate' | 'advanced' => {
  if (score >= 60) {
    // If advanced and score >= 60, cycle back to beginner
    if (currentLevel === 'advanced') {
      return 'beginner';
    }
    // If beginner -> intermediate, if intermediate -> advanced
    else if (currentLevel === 'beginner') {
      return 'intermediate';
    } else {
      return 'advanced';
    }
  } else {
    // If score < 60, stay at the same level
    return currentLevel as any;
  }
};

// Fetch student scores directly from database - useful for debugging
export const fetchDebugScores = async (studentEmail: string) => {
  try {
    console.log(`DEBUG: Fetching scores directly from database for ${studentEmail}`);
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await axios.get(`${API_URL}/student/${studentEmail}?timestamp=${timestamp}`);
    console.log('DEBUG: Raw database response:', response.data);
    
    // Sort by submission date (most recent first)
    const scores = response.data || [];
    scores.sort((a: any, b: any) => {
      const dateA = new Date(a.submissionDate || a.lastUpdated || 0);
      const dateB = new Date(b.submissionDate || b.lastUpdated || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return scores;
  } catch (error) {
    console.error('DEBUG: Error fetching scores from database:', error);
    throw error;
  }
};

// DIRECT recommendation implementation following EXACT rules:
// 1. If a student scores ≥60% on a BEGINNER course, recommend an INTERMEDIATE course in SAME TOPIC.
// 2. If a student scores ≥60% on an INTERMEDIATE course, recommend an ADVANCED course in SAME TOPIC.
// 3. If a student scores ≥60% on an ADVANCED course, recommend a BEGINNER course in SAME TOPIC (cycling back).
// 4. If a student scores <60% on ANY level course, recommend ANOTHER course at the SAME LEVEL in SAME TOPIC.
// Only use the 2 most recent scores, one recommendation per score.
const getDirectRecommendations = (scores: any[], availableCourses: Course[]): Course[] => {
  console.log("\n========= DIRECT RECOMMENDATION APPROACH =========");
  console.log(`Starting with ${scores.length} most recent scores`);
  
  // IMPORTANT: Log all available courses for troubleshooting
  console.log("\nALL AVAILABLE COURSES FOR MATCHING:");
  availableCourses.forEach((course, index) => {
    const courseTopic = extractTopicFromCourse(course.title);
    let courseLevel = "unknown";
    
    if (course.title.toLowerCase().includes("beginner") || course.title.toLowerCase().includes("beginer")) {
      courseLevel = "beginner";
    } else if (course.title.toLowerCase().includes("intermediate")) {
      courseLevel = "intermediate";
    } else if (course.title.toLowerCase().includes("advanced")) {
      courseLevel = "advanced";
    }
    
    console.log(`${index+1}. ID:${course.id} - "${course.title}" - Topic: "${courseTopic}", Level: "${courseLevel}"`);
  });
  
  // Create an empty array for our recommendations (max 2)
  const recommendations: Course[] = [];
  
  // Process each score (max 2), most recent first
  for (const score of scores) {
    // Break once we have 2 recommendations
    if (recommendations.length >= 2) break;
    
    console.log(`\n----- Processing Score: ${score.courseName} (${score.percentageScore}%) -----`);
    
    if (!score.courseName) {
      console.log("Missing course name, skipping this score");
      continue;
    }
    
    // Parse the course name to extract information
    const courseName = score.courseName;
    const courseScore = score.percentageScore || 0;
    
    // 1. Determine the CURRENT level (beginner, intermediate, advanced)
    let currentLevel = "unknown";
    if (courseName.toLowerCase().includes("beginner") || courseName.toLowerCase().includes("beginer")) {
      currentLevel = "beginner";
    } else if (courseName.toLowerCase().includes("intermediate")) {
      currentLevel = "intermediate";
    } else if (courseName.toLowerCase().includes("advanced")) {
      currentLevel = "advanced";
    } else {
      console.log(`Could not determine level from course name "${courseName}", assuming beginner`);
      currentLevel = "beginner";
    }
    console.log(`Current level: ${currentLevel}`);
    
    // 2. Determine the TARGET level based on score
    let targetLevel = currentLevel; // Default is same level
    
    if (courseScore >= 60) {
      // If score is good, move to next level or cycle back
      if (currentLevel === "beginner") {
        targetLevel = "intermediate";
        console.log("Score ≥60% on beginner course → recommending intermediate level");
      } else if (currentLevel === "intermediate") {
        targetLevel = "advanced";
        console.log("Score ≥60% on intermediate course → recommending advanced level");
      } else if (currentLevel === "advanced") {
        targetLevel = "beginner";
        console.log("Score ≥60% on advanced course → recommending beginner level (cycling back)");
      }
    } else {
      // If score is poor, stay at same level
      console.log(`Score <60% → recommending same level (${currentLevel})`);
    }
    
    // 3. Extract the TOPIC from the course name
    let topic = extractTopicFromCourse(courseName);
    console.log(`Extracted topic: "${topic}"`);
    
    // 4. Find courses that match our criteria
    console.log(`Looking for courses with topic "${topic}" at level "${targetLevel}"`);
    
    // First: Try to find EXACT topic match with specific examples of known curriculum progression
    // Example: "Fundamentals of Arithmetic - Beginner" (score ≥60%) → "Fundamentals of Arithmetic - Intermediate"
    // This is for courses we know have an explicit progression
    let exactCourseMatch = null;
    
    // For Arithmetic progression
    if (courseName === "Fundamentals of Arithmetic - Beginer" && courseScore >= 60 && targetLevel === "intermediate") {
      // Find "Fundamentals of Arithmetic - Intermediate" or similar
      exactCourseMatch = availableCourses.find(c => 
        c.title === "Fundamentals of Arithmetic - Intermediate" && 
        !recommendations.some(r => r.id === c.id)
      );
      console.log("Checking for exact progression match for Arithmetic:", exactCourseMatch?.title || "not found");
    }
    
    // For Algebra progression
    if (courseName === "Introduction to Algebra - Beginer" && courseScore >= 60 && targetLevel === "intermediate") {
      // Find "Intermediate Algebra" or similar
      exactCourseMatch = availableCourses.find(c => 
        c.title === "Intermediate Algebra" && 
        !recommendations.some(r => r.id === c.id)
      );
      console.log("Checking for exact progression match for Algebra:", exactCourseMatch?.title || "not found");
    }
    
    // For Classical Mechanics progression
    if (courseName === "Classical Mechanics - Intermediate" && courseScore >= 60 && targetLevel === "advanced") {
      // Find "Classical Mechanics - Advanced" or similar
      exactCourseMatch = availableCourses.find(c => 
        c.title === "Classical Mechanics - Advanced" && 
        !recommendations.some(r => r.id === c.id)
      );
      console.log("Checking for exact progression match for Mechanics:", exactCourseMatch?.title || "not found");
    }
    
    // If we found an exact match, add it directly
    if (exactCourseMatch) {
      console.log(`Adding exact course progression match: "${exactCourseMatch.title}" (ID: ${exactCourseMatch.id})`);
      recommendations.push(exactCourseMatch);
      continue; // Skip to next score
    }
    
    // If no exact course progression match, fall back to general topic+level matching
    // Filter available courses to find matches
    const matchingCourses = availableCourses.filter(course => {
      // Skip this course if it's the same one student just completed
      if (course.title === courseName) {
        return false;
      }
      
      // Skip course with ID 3
      if (course.id === '3') {
        return false;
      }
      
      // Skip courses the student is enrolled in
      if (course.progress && course.progress > 0) {
        return false;
      }
      
      // Skip courses already in our recommendations
      if (recommendations.some(rec => rec.id === course.id)) {
        return false;
      }
      
      // Extract this course's topic and level
      const courseTopic = extractTopicFromCourse(course.title);
      let courseLevel = "unknown";
      
      if (course.title.toLowerCase().includes("beginner") || course.title.toLowerCase().includes("beginer")) {
        courseLevel = "beginner";
      } else if (course.title.toLowerCase().includes("intermediate")) {
        courseLevel = "intermediate";
      } else if (course.title.toLowerCase().includes("advanced")) {
        courseLevel = "advanced";
      } else {
        return false; // Skip if level can't be determined
      }
      
      // Print detailed matching info
      const topicMatches = courseTopic === topic;
      const levelMatches = courseLevel === targetLevel;
      
      console.log(`  Checking: ${course.title} - Topic: ${courseTopic} (${topicMatches ? 'MATCH' : 'NO MATCH'}), Level: ${courseLevel} (${levelMatches ? 'MATCH' : 'NO MATCH'})`);
      
      // Check if this course matches our target criteria
      return topicMatches && levelMatches;
    });
    
    console.log(`Found ${matchingCourses.length} matching courses`);
    
    // 5. If we found matching courses, add the first one to recommendations
    if (matchingCourses.length > 0) {
      const recommendedCourse = matchingCourses[0];
      console.log(`Adding recommendation: "${recommendedCourse.title}" (ID: ${recommendedCourse.id})`);
      recommendations.push(recommendedCourse);
    } else {
      console.log(`No matching courses found for topic "${topic}" at level "${targetLevel}"`);
    }
  }
  
  console.log(`\nFinal recommendation count: ${recommendations.length}`);
  recommendations.forEach((rec, index) => {
    console.log(`Recommendation #${index+1}: "${rec.title}" (ID: ${rec.id})`);
  });
  console.log("===================================================\n");
  
  return recommendations;
};

// Helper function to extract the topic from a course name
function extractTopicFromCourse(courseName: string): string {
  console.log(`  Extracting topic from: "${courseName}"`);
  
  // VERY SPECIFIC COURSE NAME MATCHING
  // These exact matches ensure we extract the correct topics from specific courses
  if (courseName === "Fundamentals of Arithmetic - Beginer" ||
      courseName === "Fundamentals of Arithmetic - Beginner") {
    console.log("  → Direct match: Arithmetic");
    return "Arithmetic";
  }
  
  if (courseName === "Fundamentals of Arithmetic - Intermediate") {
    console.log("  → Direct match: Arithmetic");
    return "Arithmetic";
  }
  
  if (courseName === "Fundamentals of Arithmetic - Advanced") {
    console.log("  → Direct match: Arithmetic");
    return "Arithmetic";
  }
  
  if (courseName === "Introduction to Algebra - Beginer" || 
      courseName === "Introduction to Algebra - Beginner") {
    console.log("  → Direct match: Algebra");
    return "Algebra";
  }
  
  if (courseName === "Intermediate Algebra") {
    console.log("  → Direct match: Algebra");
    return "Algebra";
  }
  
  if (courseName === "Advanced Algebra") {
    console.log("  → Direct match: Algebra");
    return "Algebra";
  }
  
  if (courseName === "Classical Mechanics - Beginner") {
    console.log("  → Direct match: Mechanics");
    return "Mechanics";
  }
  
  if (courseName === "Classical Mechanics - Intermediate") {
    console.log("  → Direct match: Mechanics");
    return "Mechanics";
  }
  
  if (courseName === "Classical Mechanics - Advanced") {
    console.log("  → Direct match: Mechanics");
    return "Mechanics";
  }
  
  // Remove level indicators
  const nameWithoutLevel = courseName.toLowerCase()
    .replace(/beginner|beginer|intermediate|advanced/g, '')
    .replace(/[-–—].*$/, '')
    .trim();
  
  console.log(`  Cleaned name: "${nameWithoutLevel}"`);
  
  // Extract the main subject area
  if (nameWithoutLevel.includes("arithmetic")) {
    return "Arithmetic";
  }
  if (nameWithoutLevel.includes("algebra")) {
    return "Algebra";
  }
  if (nameWithoutLevel.includes("geometry")) {
    return "Geometry";
  }
  if (nameWithoutLevel.includes("calculus")) {
    return "Calculus";
  }
  if (nameWithoutLevel.includes("thermodynamics")) {
    return "Thermodynamics";
  }
  if (nameWithoutLevel.includes("mechanics")) {
    return "Mechanics";
  }
  if (nameWithoutLevel.includes("quantum")) {
    return "Quantum Physics";
  }
  if (nameWithoutLevel.includes("chemistry")) {
    return "Chemistry";
  }
  if (nameWithoutLevel.includes("biology")) {
    return "Biology";
  }
  if (nameWithoutLevel.includes("magnetism")) {
    return "Magnetism";
  }
  if (nameWithoutLevel.includes("physics")) {
    return "Physics";
  }
  
  // If we can't determine a specific topic, use the first word as the general topic
  const firstWord = nameWithoutLevel.split(" ")[0];
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
}

// Get recommended courses based on student's quiz scores
export const getRecommendedCourses = async (
  studentEmail: string,
  availableCourses: Course[]
): Promise<Course[]> => {
  try {
    console.log(`Starting recommendation process for student: ${studentEmail}`);
    
    // Always exclude "Geometry Basics - Beginer" with ID '3'
    const filteredCourses = availableCourses.filter(course => course.id !== '3');
    
    // Log all available courses once for debugging
    console.log("ALL AVAILABLE COURSES:");
    filteredCourses.forEach((course, index) => {
      const topic = extractTopicFromCourse(course.title);
      let level = "unknown";
      
      if (course.title.toLowerCase().includes("beginner") || course.title.toLowerCase().includes("beginer")) {
        level = "beginner";
      } else if (course.title.toLowerCase().includes("intermediate")) {
        level = "intermediate";
      } else if (course.title.toLowerCase().includes("advanced")) {
        level = "advanced";
      }
      
      console.log(`${index+1}. ID:${course.id} - "${course.title}" - Topic: ${topic}, Level: ${level}`);
    });
    
    // Fetch student scores from the database with cache-busting
    let scores = [];
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await axios.get(`${API_URL}/student/${studentEmail}?timestamp=${timestamp}`);
      scores = response.data || [];
      console.log(`Found ${scores.length} score records in database`);
    } catch (error) {
      console.error("Error fetching scores:", error);
      return [{ noScoreData: true, error: "Error retrieving scores from database" } as any];
    }
    
    // If no scores, return message that user needs to complete some courses first
    if (!scores || !Array.isArray(scores) || scores.length === 0) {
      console.log("No scores found in database, returning noScoreData flag");
      return [{ noScoreData: true, message: "Complete some course quizzes to get personalized recommendations." } as any];
    }
    
    console.log(`Found ${scores.length} scores, proceeding with recommendations`);
    
    // Sort scores by date (most recent first)
    scores.sort((a, b) => {
      const dateA = new Date(a.submissionDate || a.lastUpdated || 0);
      const dateB = new Date(b.submissionDate || b.lastUpdated || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    // IMPORTANT: Take only the 2 most recent scores
    const latestScores = scores.slice(0, 2);
    console.log(`Using ONLY the ${latestScores.length} most recent scores for recommendations:`);
    latestScores.forEach((score, index) => {
      console.log(`Latest score #${index+1}: ${score.courseName} - ${score.percentageScore}% (${new Date(score.submissionDate || score.lastUpdated).toLocaleString()})`);
    });
    
    // CRITICAL FIX: Always use direct approach instead of Gemini
    // This ensures recommendations are always provided when scores exist
    console.log("USING GUARANTEED DIRECT RECOMMENDATION APPROACH");
    const recommendations = getDirectRecommendations(latestScores, filteredCourses);
    
    // Return the recommendations (might be empty if no matches were found)
    console.log("Final recommendations (based only on latest scores):");
    if (recommendations.length > 0) {
      recommendations.forEach((course, index) => console.log(`#${index+1}: ${course.title} (ID: ${course.id})`));
      return recommendations;
    } else {
      console.log("No matching recommendations found based on the student's scores");
      // Return noScoreData flag if we couldn't find any matches
      return [{ noScoreData: true, message: "Based on your latest quiz scores, we couldn't find any matching courses to recommend. Try exploring different topics!" } as any];
    }
  } catch (error) {
    console.error("Error in recommendation process:", error);
    return [{ noScoreData: true, error: "Error generating recommendations" } as any];
  }
};

// Function to submit a quiz score and trigger recommendation refresh
export const submitQuizScore = async (
  studentEmail: string, 
  courseName: string, 
  percentageScore: number,
  courseId?: string,
  subject?: string
) => {
  try {
    console.log(`Submitting quiz score for ${studentEmail}: ${courseName} - ${percentageScore}%`);
    
    // Send score to the API
    const response = await axios.post(`${API_URL}/submit`, {
      studentEmail,
      courseName,
      percentageScore,
      courseId,
      subject
    });
    
    console.log("Score submission response:", response.data);
    
    // Trigger event to refresh recommendations
    const event = new CustomEvent('quizSubmitted');
    window.dispatchEvent(event);
    
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz score:", error);
    throw error;
  }
}; 

