import React, { useState } from 'react';
import { submitAssessmentScore } from '../services/courseScoreService';

interface AssessmentSubmissionProps {
  studentEmail: string;
  courseId: string;
  moduleId: string;
  assessmentId: string;
  assessmentType: 'quiz' | 'assignment' | 'project';
  assessmentTitle: string;
  maxScore: number;
  onSubmissionComplete?: (success: boolean) => void;
}

const AssessmentSubmission: React.FC<AssessmentSubmissionProps> = ({
  studentEmail,
  courseId,
  moduleId,
  assessmentId,
  assessmentType,
  assessmentTitle,
  maxScore,
  onSubmissionComplete
}) => {
  const [score, setScore] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (score === '' || typeof score !== 'number') {
      setError('Please enter a valid score');
      return;
    }

    if (score < 0 || score > maxScore) {
      setError(`Score must be between 0 and ${maxScore}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitAssessmentScore(
        studentEmail,
        courseId,
        moduleId,
        assessmentId,
        assessmentType,
        score,
        maxScore
      );
      
      setSuccess(true);
      if (onSubmissionComplete) {
        onSubmissionComplete(true);
      }
    } catch (err) {
      setError('Failed to submit assessment score. Please try again.');
      if (onSubmissionComplete) {
        onSubmissionComplete(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Submit Score for {assessmentTitle}</h2>
      
      {success ? (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
          Score submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
              Score (out of {maxScore})
            </label>
            <input
              type="number"
              id="score"
              value={score}
              onChange={(e) => setScore(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
              max={maxScore}
              step="1"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Score'}
          </button>
        </form>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Assessment Type: {assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)}</p>
        <p>Module ID: {moduleId}</p>
        <p>Course ID: {courseId}</p>
      </div>
    </div>
  );
};

export default AssessmentSubmission; 