import React, { useState, useEffect } from 'react';
import { submitAssessmentScore } from '../../../backend/services/courseScoreService';

interface AssessmentHandlerProps {
  studentEmail: string;
  courseId: string;
  moduleId: string;
  assessmentId: string;
  assessmentType: 'quiz' | 'assignment' | 'project';
  _assessmentTitle: string;
  maxScore: number;
  children: React.ReactNode;
  onScoreSubmitted?: (success: boolean) => void;
}

const AssessmentHandler: React.FC<AssessmentHandlerProps> = ({
  studentEmail: propStudentEmail,
  courseId,
  moduleId,
  assessmentId,
  assessmentType,
  _assessmentTitle: assessmentTitle,
  maxScore,
  children,
  onScoreSubmitted
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState<string>(propStudentEmail);

  // Use the email from localStorage if available
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setStudentEmail(storedEmail);
    }
  }, []);

  // This would be called by the actual assessment component when completed
  const handleAssessmentComplete = async (calculatedScore: number) => {
    if (isSubmitting || isSubmitted) return;
    
    setScore(calculatedScore);
    setIsSubmitting(true);
    setError(null);
    setDebugInfo(null);

    // Get course name for this course ID
    let courseName = '';
    try {
      // Try to find course info
      const coursesData = localStorage.getItem('coursesData');
      if (coursesData) {
        const courses = JSON.parse(coursesData);
        const course = courses[courseId];
        if (course) {
          courseName = course.title;
        }
      }
    } catch (e) {
      console.warn('Could not get course name:', e);
    }
    
    // Calculate percentage score
    const percentageScore = Math.round((calculatedScore / maxScore) * 100);

    // Log submission
    console.log("Submitting score with parameters:", {
      studentEmail,
      courseId,
      courseTitle: courseName || "Unknown Course",
      moduleId,
      assessmentId,
      assessmentType,
      score: calculatedScore,
      maxScore,
      percentageScore
    });

    try {
      const response = await submitAssessmentScore(
        studentEmail,
        courseId,
        moduleId,
        assessmentId,
        assessmentType,
        calculatedScore,
        maxScore,
        courseName || "Unknown Course",
        percentageScore
      );
      
      console.log("Score submission response:", response);
      setIsSubmitted(true);
      if (onScoreSubmitted) {
        onScoreSubmitted(true);
      }
    } catch (err: any) {
      console.error("Error submitting score:", err);
      
      // Extract detailed error information
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Failed to submit score. Please try again.';
      
      setError(errorMessage);
      
      // Add debug info
      setDebugInfo(JSON.stringify({
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      }, null, 2));
      
      if (onScoreSubmitted) {
        onScoreSubmitted(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct API test function that bypasses axios
  const testDirectSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setDebugInfo(null);
      
      // Get course name for this course ID
      let courseName = '';
      try {
        // Try to find course info from parent component or localStorage
        const coursesData = localStorage.getItem('coursesData');
        if (coursesData) {
          const courses = JSON.parse(coursesData);
          const course = courses[courseId];
          if (course) {
            courseName = course.title;
          }
        }
      } catch (e) {
        console.warn('Could not get course name from localStorage:', e);
      }
      
      // Calculate test score and percentage
      const testScore = Math.floor(maxScore * 0.6); // 60% score
      const percentageScore = 60; // Fixed at 60%
      
      console.log("Direct API test with parameters:", {
        studentEmail,
        courseId,
        moduleId,
        assessmentId,
        assessmentType,
        score: testScore,
        maxScore,
        courseName: courseName || "Test Course",
        percentageScore
      });
      
      // Direct fetch call to test API
      const response = await fetch('http://localhost:5001/api/scores/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail,
          courseId,
          moduleId,
          assessmentId,
          assessmentType,
          score: testScore,
          maxScore,
          courseName: courseName || "Test Course",
          percentageScore
        })
      });
      
      // Get raw response as text first
      const rawText = await response.text();
      console.log('Raw API response:', rawText);
      
      // Try to parse as JSON if possible
      let jsonData;
      try {
        jsonData = JSON.parse(rawText);
        console.log('Parsed JSON response:', jsonData);
        
        if (response.ok) {
          setScore(Math.floor(maxScore * 0.6));
          setIsSubmitted(true);
          setDebugInfo("Direct API test succeeded!\n" + JSON.stringify(jsonData, null, 2));
          if (onScoreSubmitted) {
            onScoreSubmitted(true);
          }
        } else {
          setError(`HTTP error ${response.status}: ${jsonData.error || response.statusText}`);
          setDebugInfo(JSON.stringify(jsonData, null, 2));
        }
      } catch (e: any) {
        console.error('Response is not valid JSON:', e);
        setError(`API returned invalid JSON response: ${e.message}`);
        setDebugInfo(`Raw response (not JSON): ${rawText}`);
      }
    } catch (err: any) {
      console.error('Direct API fetch error:', err);
      setError(`Network error: ${err.message}`);
      setDebugInfo(err.stack);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clone the children and pass the handleAssessmentComplete function
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        onComplete: handleAssessmentComplete,
        disabled: isSubmitting || isSubmitted 
      } as any);
    }
    return child;
  });

  return (
    <div className="assessment-container">
      {isSubmitted ? (
        <div className="bg-green-50 p-4 rounded-md mb-4">
          <h3 className="text-green-800 font-medium mb-2">Assessment Completed!</h3>
          <p className="text-green-700">
            Your score of {score} out of {maxScore} has been recorded.
          </p>
          {debugInfo && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
              <pre>{debugInfo}</pre>
            </div>
          )}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <h3 className="text-red-800 font-medium mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          {debugInfo && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
              <pre>{debugInfo}</pre>
            </div>
          )}
          <button 
            onClick={() => handleAssessmentComplete(score)}
            className="mt-2 bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200"
            disabled={isSubmitting}
          >
            Try Again
          </button>
        </div>
      ) : null}

      {/* Actual assessment content */}
      {childrenWithProps}

      {/* Submit buttons for manual submission if needed */}
      {!isSubmitted && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            onClick={() => {
              // This is for manual submission - in real assessments, 
              // the score would be calculated by the assessment component
              const calculatedScore = Math.floor(Math.random() * (maxScore + 1)); // Demo only
              handleAssessmentComplete(calculatedScore);
            }}
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AssessmentHandler; 