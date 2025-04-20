import axios from 'axios';

// Backend API URL 
const API_URL = 'http://localhost:5001/api/courses/score';

// ALWAYS use online mode - the database is working now
const CONNECT_TO_BACKEND = true;

// Test connection to backend (used from troubleshooting UI)
export const testConnection = async (): Promise<boolean> => {
  try {
    // Add cache-busting parameter to prevent browser caching
    const timestamp = new Date().getTime();
    const response = await axios.get(`${API_URL}/health?t=${timestamp}`);
    console.log("MongoDB connection status:", response.data);
    return response.data.mongodb === 'connected';
  } catch (error) {
    console.error("Failed to check MongoDB connection:", error);
    return false;
  }
};

// Clear any cached offline mode flags
export const forceOnlineMode = (): void => {
  localStorage.removeItem('bypassAPI');
  console.log("Switched to online mode");
};

// Add helper function to check if we should use offline mode
const isOfflineMode = (): boolean => {
  return !CONNECT_TO_BACKEND;
};

// Function to check if backend server is running
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    // Try a simple request to check if backend is running
    await axios.get(API_URL.split('/api')[0] + '/api/status', { timeout: 2000 });
    console.log("Backend server is running and reachable");
    return true;
  } catch (error) {
    console.error("Backend server is not reachable:", error);
    return false;
  }
};

// Get a human-readable error message from API errors
export const getErrorMessage = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data && error.response.data.message) {
      return `Server error: ${error.response.data.message}`;
    }
    return `Server error (${error.response.status}): ${error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    return "Cannot connect to the server. Please check your internet connection and try again.";
  } else {
    // Something happened in setting up the request that triggered an Error
    return `Error: ${error.message || "Unknown error occurred"}`;
  }
};

// Make sure we persist mock data in localStorage
const saveMockData = () => {
  localStorage.setItem('mockScoreData', JSON.stringify(mockScoreData));
};

// Load any existing mock data from localStorage
const loadMockData = (): Record<string, CourseScore> => {
  const saved = localStorage.getItem('mockScoreData');
  return saved ? JSON.parse(saved) : {};
};

// Mock data storage for offline mode
const mockScoreData: Record<string, CourseScore> = loadMockData();

export interface AssessmentScore {
  moduleId: string;
  assessmentId: string;
  assessmentType: 'quiz' | 'assignment' | 'project';
  score: number;
  maxScore: number;
  submittedAt?: Date;
}

export interface CourseScore {
  studentId: string;
  studentEmail: string;
  studentName?: string;
  studentGrade?: string;
  studentBoard?: string;
  courseId: string;
  courseName?: string;
  percentageScore?: number;
  totalScore: number;
  submissionId?: string;
  assessments: AssessmentScore[];
  lastUpdated: Date;
}

// Submit an assessment score - simplified like StudentService
export const submitAssessmentScore = async (
  studentEmail: string,
  courseId: string,
  moduleId: string,
  assessmentId: string,
  assessmentType: 'quiz' | 'assignment' | 'project',
  score: number,
  maxScore: number,
  courseName?: string,
  percentageScore?: number,
  subject?: string
): Promise<CourseScore> => {
  try {
    // Get additional student info from localStorage
    const studentName = localStorage.getItem('userName') || 'Student';
    const studentGrade = localStorage.getItem('userGrade') || '';
    const studentBoard = localStorage.getItem('userBoard') || '';
    
    console.log(`Submitting score to ${API_URL}/submit`, {
      studentEmail, courseId, moduleId, assessmentId, 
      assessmentType, score, maxScore, courseName, percentageScore, subject
    });
    
    const response = await axios.post(`${API_URL}/submit`, {
      studentEmail,
      studentName,
      studentGrade,
      studentBoard, 
      courseId,
      moduleId,
      assessmentId,
      assessmentType,
      score,
      maxScore,
      courseName,
      percentageScore,
      subject
    });
    
    console.log('Score submission response:', response.data);
    return response.data.courseScore;
  } catch (error: any) {
    // Log error and rethrow
    console.error('Error submitting score:', error.response?.data || error.message);
    throw error;
  }
};

// Get all scores for a student - simplified
export const getStudentScores = async (studentEmail: string): Promise<CourseScore[]> => {
  try {
    const response = await axios.get(`${API_URL}/student/${studentEmail}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting student scores:', error.response?.data || error.message);
    throw error;
  }
};

// Get score for a specific course - simplified
export const getCourseScore = async (studentEmail: string, courseId: string): Promise<CourseScore> => {
  try {
    const response = await axios.get(`${API_URL}/student/${studentEmail}/course/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting course score:', error.response?.data || error.message);
    throw error;
  }
}; 