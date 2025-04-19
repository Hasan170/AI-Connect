import React, { useState } from 'react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizComponentProps {
  title: string;
  questions: Question[];
  onComplete?: (score: number) => void;
  disabled?: boolean;
}

const QuizComponent: React.FC<QuizComponentProps> = ({
  title,
  questions,
  onComplete,
  disabled = false
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (submitted || disabled) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = () => {
    if (submitted || disabled) return;
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    
    if (onComplete) {
      onComplete(calculatedScore);
    }
  };

  const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="quiz-component bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={question.id} className="question-container">
            <p className="font-medium mb-2">
              {qIndex + 1}. {question.text}
            </p>
            <div className="space-y-2 ml-4">
              {question.options.map((option, oIndex) => (
                <div 
                  key={oIndex}
                  className={`
                    p-3 rounded-md cursor-pointer border transition-colors
                    ${answers[question.id] === oIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}
                    ${submitted ? 
                      (oIndex === question.correctAnswer ? 'border-green-500 bg-green-50' : 
                      (answers[question.id] === oIndex ? 'border-red-500 bg-red-50' : 'border-gray-200')) 
                      : ''}
                    ${(submitted || disabled) ? 'pointer-events-none' : ''}
                  `}
                  onClick={() => handleAnswerSelect(question.id, oIndex)}
                >
                  {option}
                </div>
              ))}
            </div>
            {submitted && answers[question.id] !== question.correctAnswer && (
              <p className="text-sm text-red-600 mt-2">
                Correct answer: {question.options[question.correctAnswer]}
              </p>
            )}
          </div>
        ))}
      </div>
      
      {!submitted && !disabled && (
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
          >
            Submit Quiz
          </button>
        </div>
      )}
      
      {submitted && (
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-lg mb-2">Quiz Results</h3>
          <p className="text-lg">
            Your Score: <span className="font-bold">{score}%</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizComponent; 