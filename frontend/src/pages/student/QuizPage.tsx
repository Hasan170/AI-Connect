import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import AssessmentHandler from '../../components/AssessmentHandler';
import QuizComponent from '../../components/QuizComponent';
import { coursesData } from './coursesData';

const QuizPage: React.FC = () => {
  const { courseId = '', moduleId = '', lectureId = '' } = useParams<{ 
    courseId: string; 
    moduleId: string; 
    lectureId: string 
  }>();
  const [studentEmail, setStudentEmail] = useState<string>('');
  
  // Sample quiz data - in a real app, this would come from an API
  const sampleQuiz = {
    title: 'Module Assessment Quiz',
    questions: [
      {
        id: 'q1',
        text: 'What is the main purpose of a useState hook?',
        options: [
          'To fetch data from APIs',
          'To manage component state',
          'To handle side effects',
          'To optimize performance'
        ],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'Which of the following is NOT a React hook?',
        options: [
          'useEffect',
          'useState',
          'useHistory',
          'useComponent'
        ],
        correctAnswer: 3
      },
      {
        id: 'q3',
        text: 'How do you pass data from a parent to a child component?',
        options: [
          'Using context',
          'Using props',
          'Using state',
          'Using Redux'
        ],
        correctAnswer: 1
      }
    ]
  };

  // Get course and lecture info
  const course = courseId ? coursesData[courseId] : undefined;
  const module = course?.modules.find(m => m.id === moduleId);
  const lecture = module?.lectures.find(l => l.id === lectureId);

  // Get student email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setStudentEmail(email);
    }
  }, []);

  const handleNotebookClick = () => {
    console.log("Notebook clicked");
  };

  if (!course || !module || !lecture) {
    return (
      <div className="flex">
        <StudentSidebar onNotebookClick={handleNotebookClick} />
        <div className="flex-1 pt-24 px-6 pb-10 bg-background min-h-screen ml-64">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Quiz Not Found</h1>
            <p>The requested quiz could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={handleNotebookClick} />
      <div className="flex-1 pt-24 px-6 pb-10 bg-background min-h-screen ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{lecture.title}</h1>
            <p className="text-gray-600">{module.title}</p>
            <div className="text-sm text-gray-500 mt-1">
              {course.title} • {lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)}
            </div>
          </div>

          {lecture.type === 'quiz' && studentEmail && (
            <AssessmentHandler
              studentEmail={studentEmail}
              courseId={courseId}
              moduleId={moduleId}
              assessmentId={lectureId}
              assessmentType="quiz"
              assessmentTitle={lecture.title}
              maxScore={100}
              onScoreSubmitted={(success) => {
                if (success) {
                  console.log('Quiz score submitted successfully!');
                  // In a real app, you might update UI or redirect
                }
              }}
            >
              <QuizComponent 
                title={sampleQuiz.title}
                questions={sampleQuiz.questions}
              />
            </AssessmentHandler>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 