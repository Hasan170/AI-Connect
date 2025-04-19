import React, { useEffect, useState } from 'react';
import { getCourseScore, CourseScore, AssessmentScore } from '../services/courseScoreService';
import { Course } from '../pages/student/coursesData';

interface CourseScoreDisplayProps {
  studentEmail: string;
  courseId: string;
  course?: Course;
}

const CourseScoreDisplay: React.FC<CourseScoreDisplayProps> = ({
  studentEmail,
  courseId,
  course
}) => {
  const [courseScore, setCourseScore] = useState<CourseScore | null>(null);
  const [allScores, setAllScores] = useState<CourseScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseScore = async () => {
      try {
        const data = await getCourseScore(studentEmail, courseId);
        // Now data is an array of scores, so we can display the latest one
        if (Array.isArray(data) && data.length > 0) {
          setCourseScore(data[0]); // Latest score is first (sorted by lastUpdated desc)
          setAllScores(data);      // Keep all scores
          console.log(`Found ${data.length} score records for this course`);
        } else {
          setCourseScore(data);
          setAllScores(Array.isArray(data) ? data : [data]);
          console.log(`Found 1 score record for this course`);
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          // No scores yet, not an error
          setCourseScore(null);
          setAllScores([]);
        } else {
          setError('Failed to load course scores');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseScore();
  }, [studentEmail, courseId]);

  // Helper to get module and assessment titles from course data
  const getModuleTitle = (moduleId: string): string => {
    if (!course) return `Module ${moduleId}`;
    const module = course.modules.find(m => m.id === moduleId);
    return module ? module.title : `Module ${moduleId}`;
  };

  const getAssessmentTitle = (moduleId: string, assessmentId: string): string => {
    if (!course) return `Assessment ${assessmentId}`;
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return `Assessment ${assessmentId}`;
    
    const lecture = module.lectures.find(l => l.id === assessmentId);
    return lecture ? lecture.title : `Assessment ${assessmentId}`;
  };

  if (loading) {
    return <div className="text-center p-4">Loading course scores...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  if (!courseScore || courseScore.assessments.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No scores recorded for this course yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Course Scores</h2>
      
      {/* Student Information section */}
      <div className="mb-6 pb-4 border-b">
        <h3 className="text-lg font-medium mb-3">Student Information</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm bg-gray-50 p-2 rounded">
            <span className="text-gray-600 mr-2 font-medium">Name:</span>
            <span className="font-medium">{courseScore.studentName || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-sm bg-gray-50 p-2 rounded">
            <span className="text-gray-600 mr-2 font-medium">Email:</span>
            <span>{courseScore.studentEmail}</span>
          </div>
          {courseScore.studentGrade && (
            <div className="flex items-center text-sm bg-gray-50 p-2 rounded">
              <span className="text-gray-600 mr-2 font-medium">Grade:</span>
              <span>{courseScore.studentGrade}</span>
            </div>
          )}
          {courseScore.studentBoard && (
            <div className="flex items-center text-sm bg-gray-50 p-2 rounded">
              <span className="text-gray-600 mr-2 font-medium">Board:</span>
              <span>{courseScore.studentBoard}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-md">
          <div>
            <span className="font-medium">Course:</span>
            <span className="ml-2">{courseScore.courseName || course?.title || `Course ${courseScore.courseId}`}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold">{courseScore.totalScore}</span>
            {/* Display percentage score */}
            <span className="text-sm text-gray-600">
              {courseScore.percentageScore !== undefined 
                ? `${courseScore.percentageScore}%` 
                : (() => {
                    const totalPossible = courseScore.assessments.reduce((sum, a) => sum + a.maxScore, 0);
                    const percentage = totalPossible > 0 
                      ? Math.round((courseScore.totalScore / totalPossible) * 100) 
                      : 0;
                    return `${percentage}%`;
                  })()
              } 
              ({courseScore.totalScore}/{courseScore.assessments.reduce((sum, a) => sum + a.maxScore, 0)})
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Assessment Breakdown</h3>
        
        {courseScore.assessments.map((assessment: AssessmentScore) => (
          <div 
            key={`${assessment.moduleId}-${assessment.assessmentId}`}
            className="border rounded-md p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">
                {getAssessmentTitle(assessment.moduleId, assessment.assessmentId)}
              </h4>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {assessment.assessmentType}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {getModuleTitle(assessment.moduleId)}
            </p>
            
            <div className="flex justify-between text-sm mb-1">
              <span>Score:</span>
              <span className="font-medium">{assessment.score} / {assessment.maxScore}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(assessment.score / assessment.maxScore) * 100}%` }}
              ></div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Submitted: {assessment.submittedAt ? new Date(assessment.submittedAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-4">
        Last updated: {new Date(courseScore.lastUpdated).toLocaleString()}
      </div>

      {/* Display multiple submissions if available */}
      {allScores.length > 1 && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-medium mb-3">All Submissions ({allScores.length})</h3>
          <div className="space-y-3">
            {allScores.map((score, index) => (
              <div key={score.submissionId || index} className="bg-gray-50 p-3 rounded-md text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">
                    {index === 0 ? 'Latest Submission' : `Submission ${allScores.length - index}`}
                  </span>
                  <span className="text-green-600 font-medium">
                    {score.percentageScore || Math.round((score.totalScore / score.assessments[0]?.maxScore || 1) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Score: {score.totalScore} / {score.assessments[0]?.maxScore || '?'}</span>
                  <span>{new Date(score.lastUpdated).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseScoreDisplay; 