import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayCircle, 
  FileText, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Award, 
  MessageSquare, 
  Download,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Users,
  Star,
  AlertCircle,
  Check
} from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import { Course, Lecture as BaseLecture, coursesData } from './coursesData';
import { submitAssessmentScore } from '../../services/courseScoreService';

interface ExpandedModules {
  [key: string]: boolean;
}

// Extend the base Lecture type to include moduleId
interface Lecture extends BaseLecture {
  moduleId?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

const MyCourses: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModules, setExpandedModules] = useState<ExpandedModules>({});
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'overview' | 'discussion' | 'notes'>('content');
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        setTimeout(() => {
          if (courseId && coursesData[courseId]) {
            const foundCourse = coursesData[courseId];
            setCourse(foundCourse);

            // Expand first incomplete module
            const firstIncompleteModule = foundCourse.modules.find(module => 
              module.lectures.some(lecture => !lecture.completed)
            );
            if (firstIncompleteModule) {
              setExpandedModules(prev => ({
                ...prev,
                [firstIncompleteModule.id]: true
              }));
            }
          } else {
            setError('Course not found');
          }
          setLoading(false);
        }, 800);
      } catch (error) {
        setError('Failed to load course data');
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleLectureClick = (lecture: Lecture, moduleId: string) => {
    // Add moduleId to the lecture object
    const lectureWithModuleId = {
      ...lecture,
      moduleId: moduleId
    };
    
    setCurrentLecture(lectureWithModuleId);
    
    if (lecture.type === 'video' && lecture.url) {
      setCurrentVideo(lecture.url);
      setShowQuiz(false);
    } else if (lecture.type === 'assessment') {
      setCurrentVideo(null);
      setShowQuiz(true);
      generateQuizQuestions(lecture);
    } else {
      setCurrentVideo(null);
      setShowQuiz(false);
    }

    // Update completion status
    if (!lecture.completed && course) {
      const updatedModules = course.modules.map(module => ({
        ...module,
        lectures: module.lectures.map(l => 
          l.id === lecture.id ? { ...l, completed: true } : l
        )
      }));

      setCourse({
        ...course,
        modules: updatedModules,
        completedModules: updatedModules.filter(module => 
          module.lectures.every(l => l.completed)
        ).length
      });
    }
  };

  const generateQuizQuestions = (lecture: Lecture) => {
    // Reset quiz state
    setQuizSubmitted(false);

    // Get course information
    const subject = course?.subject || '';
    const courseTitle = course?.title || '';
    const isAdvanced = courseTitle.includes('Advanced');
    const isIntermediate = courseTitle.includes('Intermediate');
    const isBeginner = courseTitle.includes('Beginer') || courseTitle.includes('Beginner');
    
    let generatedQuestions: QuizQuestion[] = [];
    
    // Generate questions based on course title and level
    if (subject === 'Mathematics') {
        if (courseTitle.includes('Arithmetic')) {
            if (isBeginner) {
      generatedQuestions = [
        {
          id: 'q1',
                        question: 'What is the result of 25 + 37?',
                        options: ['52', '62', '72', '82'],
          correctAnswer: 1
        },
        {
          id: 'q2',
                        question: 'If you have 3/4 of a pizza and eat 1/4, how much is left?',
                        options: ['1/4', '1/2', '3/4', '1'],
                        correctAnswer: 1
        },
        {
          id: 'q3',
                        question: 'What is 15% of 200?',
                        options: ['20', '25', '30', '35'],
                        correctAnswer: 2
        },
        {
          id: 'q4',
                        question: 'Solve: 8 × 7 = ?',
                        options: ['48', '54', '56', '64'],
          correctAnswer: 2
        },
        {
          id: 'q5',
                        question: 'What is the next number in the sequence: 2, 4, 8, 16, ?',
                        options: ['24', '32', '30', '28'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q6',
                        question: 'Convert 0.75 to a fraction',
                        options: ['1/4', '1/2', '3/4', '4/5'],
          correctAnswer: 2
        },
        {
                        id: 'q7',
                        question: 'What is the greatest common factor of 24 and 36?',
                        options: ['6', '8', '12', '24'],
                        correctAnswer: 2
                    },
                    {
                        id: 'q8',
                        question: 'Solve: 144 ÷ 12 = ?',
                        options: ['10', '11', '12', '13'],
                        correctAnswer: 2
                    },
                    {
                        id: 'q9',
                        question: 'What is the least common multiple of 6 and 8?',
                        options: ['12', '24', '36', '48'],
          correctAnswer: 1
        },
        {
                        id: 'q10',
                        question: 'If a shirt costs $25 and is on sale for 20% off, what is the final price?',
                        options: ['$15', '$18', '$20', '$22'],
          correctAnswer: 2
        },
        {
                        id: 'q11',
                        question: 'What is the square root of 81?',
                        options: ['7', '8', '9', '10'],
          correctAnswer: 2
        },
        {
                        id: 'q12',
                        question: 'Solve: 3² + 4² = ?',
                        options: ['20', '21', '22', '25'],
                        correctAnswer: 3
                    },
                    {
                        id: 'q13',
                        question: 'What is the value of π (pi) to two decimal places?',
                        options: ['3.12', '3.14', '3.16', '3.18'],
          correctAnswer: 1
                    },
                    {
                        id: 'q14',
                        question: 'If you have 2.5 hours, how many minutes is that?',
                        options: ['120', '150', '180', '200'],
          correctAnswer: 1
        },
        {
                        id: 'q15',
                        question: 'What is the perimeter of a square with sides of length 5?',
                        options: ['15', '20', '25', '30'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q16',
                        question: 'Solve: 1000 - 456 = ?',
                        options: ['444', '544', '554', '564'],
          correctAnswer: 1
        },
        {
                        id: 'q17',
                        question: 'What is the area of a rectangle with length 8 and width 6?',
                        options: ['42', '44', '46', '48'],
          correctAnswer: 3
        },
        {
                        id: 'q18',
                        question: 'If you have 3/8 of a cake and want to divide it equally among 3 people, how much does each person get?',
                        options: ['1/8', '1/6', '1/4', '1/3'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q19',
                        question: 'What is the next number in the sequence: 1, 3, 6, 10, ?',
                        options: ['12', '14', '15', '16'],
                        correctAnswer: 2
                    },
                    {
                        id: 'q20',
                        question: 'If a car travels 240 miles in 4 hours, what is its average speed?',
                        options: ['50 mph', '55 mph', '60 mph', '65 mph'],
                        correctAnswer: 2
                    }
                ];
            } else if (isIntermediate) {
      generatedQuestions = [
        {
          id: 'q1',
                        question: 'What is the prime factorization of 72?',
                        options: ['2² × 3²', '2³ × 3²', '2² × 3³', '2³ × 3³'],
          correctAnswer: 1
        },
        {
          id: 'q2',
                        question: 'Solve: 3/4 ÷ 2/3 = ?',
                        options: ['1/2', '9/8', '8/9', '3/2'],
                        correctAnswer: 1
        },
        {
          id: 'q3',
                        question: 'What is the greatest common divisor of 48 and 72?',
                        options: ['12', '16', '24', '36'],
          correctAnswer: 2
        },
        {
          id: 'q4',
                        question: 'If a number is increased by 20% and then decreased by 20%, what is the net change?',
                        options: ['No change', '4% decrease', '4% increase', '20% decrease'],
          correctAnswer: 1
        },
        {
          id: 'q5',
                        question: 'What is the least common multiple of 12, 15, and 20?',
                        options: ['60', '120', '180', '240'],
          correctAnswer: 1
                    },
                    {
                        id: 'q6',
                        question: 'Solve: (2³ × 3²) ÷ (2² × 3) = ?',
                        options: ['6', '8', '12', '24'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q7',
                        question: 'What is the sum of all prime numbers between 20 and 40?',
                        options: ['120', '130', '140', '150'],
                        correctAnswer: 2
                    },
                    {
                        id: 'q8',
                        question: 'If 3/5 of a number is 45, what is the number?',
                        options: ['60', '65', '70', '75'],
                        correctAnswer: 3
                    },
                    {
                        id: 'q9',
                        question: 'What is the value of (1 + 2 + 3 + ... + 10)?',
                        options: ['45', '50', '55', '60'],
                        correctAnswer: 2
                    },
                    {
                        id: 'q10',
                        question: 'Solve: 2.5 × 3.6 = ?',
                        options: ['8.5', '9.0', '9.5', '10.0'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q11',
                        question: 'What is the next number in the sequence: 2, 3, 5, 9, 17, ?',
                        options: ['25', '29', '33', '37'],
                        correctAnswer: 2
                    },
                    {
                        id: 'q12',
                        question: 'If a rectangle\'s area is 48 and its perimeter is 28, what are its dimensions?',
                        options: ['4 × 12', '6 × 8', '7 × 7', '8 × 6'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q13',
                        question: 'What is the sum of the first 10 perfect squares?',
                        options: ['285', '385', '485', '585'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q14',
                        question: 'Solve: 1/2 + 1/3 + 1/4 = ?',
                        options: ['11/12', '13/12', '15/12', '17/12'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q15',
                        question: 'What is the value of (1 - 1/2)(1 - 1/3)(1 - 1/4)?',
                        options: ['1/4', '1/3', '1/2', '2/3'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q16',
                        question: 'If a number is divisible by both 6 and 8, what is the smallest number it could be?',
                        options: ['12', '24', '36', '48'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q17',
                        question: 'What is the sum of all factors of 24?',
                        options: ['50', '60', '70', '80'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q18',
                        question: 'Solve: 1.25 × 0.8 = ?',
                        options: ['0.9', '1.0', '1.1', '1.2'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q19',
                        question: 'What is the next number in the sequence: 1, 2, 4, 7, 11, ?',
                        options: ['14', '15', '16', '17'],
                        correctAnswer: 2
                    },
                    {
                        id: 'q20',
                        question: 'If a number is increased by 25% and then decreased by 20%, what is the net change?',
                        options: ['No change', '5% decrease', '5% increase', '25% increase'],
                        correctAnswer: 0
                    }
                ];
            } else if (isAdvanced) {
      generatedQuestions = [
        {
          id: 'q1',
                        question: 'What is the value of the infinite series 1 + 1/2 + 1/4 + 1/8 + ...?',
                        options: ['1', '2', '3', '4'],
                        correctAnswer: 1
        },
        {
          id: 'q2',
                        question: 'What is the greatest common divisor of 2¹⁰⁰ - 1 and 2⁵⁰ - 1?',
                        options: ['2²⁵ - 1', '2⁵⁰ - 1', '2⁷⁵ - 1', '2¹⁰⁰ - 1'],
                        correctAnswer: 0
        },
        {
          id: 'q3',
                        question: 'What is the sum of all positive integers n such that n² + 1 is prime?',
                        options: ['1', '2', '3', '4'],
                        correctAnswer: 1
        },
        {
          id: 'q4',
                        question: 'What is the value of the infinite product (1 - 1/2²)(1 - 1/3²)(1 - 1/4²)...?',
                        options: ['1/2', '1/3', '1/4', '1/6'],
                        correctAnswer: 0
        },
        {
          id: 'q5',
                        question: 'What is the smallest positive integer n such that n! is divisible by 1000?',
                        options: ['10', '15', '20', '25'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q6',
                        question: 'What is the value of the infinite series 1 - 1/3 + 1/5 - 1/7 + ...?',
                        options: ['π/2', 'π/4', 'π/6', 'π/8'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q7',
                        question: 'What is the greatest common divisor of 2¹⁰⁰⁰ - 1 and 2⁵⁰⁰ - 1?',
                        options: ['2²⁵⁰ - 1', '2⁵⁰⁰ - 1', '2⁷⁵⁰ - 1', '2¹⁰⁰⁰ - 1'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q8',
                        question: 'What is the sum of all positive integers n such that n² + 2 is prime?',
                        options: ['1', '2', '3', '4'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q9',
                        question: 'What is the value of the infinite product (1 + 1/2²)(1 + 1/3²)(1 + 1/4²)...?',
                        options: ['π/2', 'π/4', 'π/6', 'π/8'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q10',
                        question: 'What is the smallest positive integer n such that n! is divisible by 10000?',
                        options: ['15', '20', '25', '30'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q11',
                        question: 'What is the value of the infinite series 1 + 1/3 + 1/5 + 1/7 + ...?',
                        options: ['π/2', 'π/4', 'π/6', 'π/8'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q12',
                        question: 'What is the greatest common divisor of 2²⁰⁰⁰ - 1 and 2¹⁰⁰⁰ - 1?',
                        options: ['2⁵⁰⁰ - 1', '2¹⁰⁰⁰ - 1', '2¹⁵⁰⁰ - 1', '2²⁰⁰⁰ - 1'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q13',
                        question: 'What is the sum of all positive integers n such that n² + 3 is prime?',
                        options: ['1', '2', '3', '4'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q14',
                        question: 'What is the value of the infinite product (1 - 1/2³)(1 - 1/3³)(1 - 1/4³)...?',
                        options: ['1/2', '1/3', '1/4', '1/6'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q15',
                        question: 'What is the smallest positive integer n such that n! is divisible by 100000?',
                        options: ['20', '25', '30', '35'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q16',
                        question: 'What is the value of the infinite series 1 - 1/2 + 1/3 - 1/4 + ...?',
                        options: ['ln(2)', 'ln(3)', 'ln(4)', 'ln(5)'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q17',
                        question: 'What is the greatest common divisor of 2³⁰⁰⁰ - 1 and 2¹⁵⁰⁰ - 1?',
                        options: ['2⁷⁵⁰ - 1', '2¹⁵⁰⁰ - 1', '2²²⁵⁰ - 1', '2³⁰⁰⁰ - 1'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q18',
                        question: 'What is the sum of all positive integers n such that n² + 4 is prime?',
                        options: ['1', '2', '3', '4'],
                        correctAnswer: 1
                    },
                    {
                        id: 'q19',
                        question: 'What is the value of the infinite product (1 + 1/2³)(1 + 1/3³)(1 + 1/4³)...?',
                        options: ['π/2', 'π/4', 'π/6', 'π/8'],
                        correctAnswer: 0
                    },
                    {
                        id: 'q20',
                        question: 'What is the smallest positive integer n such that n! is divisible by 1000000?',
                        options: ['25', '30', '35', '40'],
          correctAnswer: 1
        }
      ];
    }
        } else if (courseTitle.includes('Algebra')) {
            if (isBeginner) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the value of x in the equation x + 5 = 12?', options: ['5', '6', '7', '17'], correctAnswer: 2 },
                    { id: 'q2', question: 'Simplify: 2x + 3x', options: ['5', '2x', '3x', '5x'], correctAnswer: 3 },
                    { id: 'q3', question: 'What is the coefficient of x in 7x + 4?', options: ['4', '7', '11', '1'], correctAnswer: 1 },
                    { id: 'q4', question: 'Evaluate: 3(x - 2) when x = 4', options: ['2', '4', '6', '8'], correctAnswer: 3 },
                    { id: 'q5', question: 'Which of the following is a variable?', options: ['3', 'x', '7', '10'], correctAnswer: 1 },
                    { id: 'q6', question: 'What is the solution to x/2 = 6?', options: ['3', '6', '12', '18'], correctAnswer: 2 },
                    { id: 'q7', question: 'Combine like terms: 4y + 2y', options: ['2y', '4y', '6y', '8y'], correctAnswer: 2 },
                    { id: 'q8', question: 'What is the value of y if 2y = 10?', options: ['2', '4', '5', '10'], correctAnswer: 2 },
                    { id: 'q9', question: 'Which is an algebraic expression?', options: ['5 + 3', 'x + 2', '7 - 2', '10 / 2'], correctAnswer: 1 },
                    { id: 'q10', question: 'What is the value of 2a + 3b when a = 2, b = 3?', options: ['6', '12', '13', '5'], correctAnswer: 2 },
                    { id: 'q11', question: 'What is the solution to x - 7 = 0?', options: ['0', '7', '-7', '14'], correctAnswer: 1 },
                    { id: 'q12', question: 'Which of the following is a constant?', options: ['x', 'y', '5', 'z'], correctAnswer: 2 },
                    { id: 'q13', question: 'Simplify: 5x - 2x', options: ['3x', '7x', '2x', '5x'], correctAnswer: 0 },
                    { id: 'q14', question: 'What is the value of x if 3x = 15?', options: ['3', '5', '6', '15'], correctAnswer: 1 },
                    { id: 'q15', question: 'What is the sum of 2x and 4?', options: ['2x + 4', '6x', '8', '2x4'], correctAnswer: 0 },
                    { id: 'q16', question: 'What is the product of x and 7?', options: ['x + 7', '7x', 'x - 7', 'x/7'], correctAnswer: 1 },
                    { id: 'q17', question: 'If x = 3, what is the value of x²?', options: ['3', '6', '9', '12'], correctAnswer: 2 },
                    { id: 'q18', question: 'What is the value of x in 2x + 4 = 10?', options: ['2', '3', '4', '5'], correctAnswer: 1 },
                    { id: 'q19', question: 'Which of the following is a linear equation?', options: ['x² + 2 = 0', 'x + 2 = 0', 'x³ = 8', 'x/2 = 1'], correctAnswer: 1 },
                    { id: 'q20', question: 'What is the value of x in x/4 = 5?', options: ['1', '5', '9', '20'], correctAnswer: 3 },
                ];
            } else if (isIntermediate) {
                generatedQuestions = [
                    { id: 'q1', question: 'Solve for x: 2x + 3 = 11', options: ['3', '4', '5', '6'], correctAnswer: 1 },
                    { id: 'q2', question: 'What is the solution to 3(x - 2) = 9?', options: ['1', '2', '3', '5'], correctAnswer: 3 },
                    { id: 'q3', question: 'Factor: x² - 9', options: ['(x - 3)(x + 3)', '(x - 9)(x + 1)', '(x - 1)(x + 9)', '(x - 2)(x + 2)'], correctAnswer: 0 },
                    { id: 'q4', question: 'Simplify: 4(x + 2) - 2x', options: ['2x + 8', '4x + 2', '2x + 4', '2x + 6'], correctAnswer: 0 },
                    { id: 'q5', question: 'What is the value of x if x² = 49?', options: ['5', '6', '7', '8'], correctAnswer: 2 },
                    { id: 'q6', question: 'Expand: (x + 2)(x - 2)', options: ['x² - 4', 'x² + 4', 'x² - 2', 'x² + 2'], correctAnswer: 0 },
                    { id: 'q7', question: 'What is the solution to 5x = 2x + 9?', options: ['1', '2', '3', '4'], correctAnswer: 2 },
                    { id: 'q8', question: 'Simplify: 3x² + 2x - x²', options: ['2x² + 2x', '3x² + x', '2x² + x', 'x² + 2x'], correctAnswer: 0 },
                    { id: 'q9', question: 'What is the value of x in x/3 + 2 = 5?', options: ['7', '8', '9', '12'], correctAnswer: 2 },
                    { id: 'q10', question: 'Factor: x² + 5x + 6', options: ['(x + 2)(x + 3)', '(x + 1)(x + 6)', '(x + 2)(x + 4)', '(x + 3)(x + 4)'], correctAnswer: 0 },
                    { id: 'q11', question: 'Solve for y: 2y - 4 = 10', options: ['5', '6', '7', '8'], correctAnswer: 1 },
                    { id: 'q12', question: 'What is the solution to x² - 4x = 0?', options: ['0, 4', '2, -2', '0, -4', '4, -4'], correctAnswer: 0 },
                    { id: 'q13', question: 'Expand: (x + 1)²', options: ['x² + 1', 'x² + 2x + 1', 'x² + x + 1', 'x² + 2x'], correctAnswer: 1 },
                    { id: 'q14', question: 'What is the value of x in 2x² = 18?', options: ['2', '3', '4', '5'], correctAnswer: 2 },
                    { id: 'q15', question: 'Simplify: 6x - 2(x + 3)', options: ['4x - 6', '4x + 6', '6x - 6', '6x + 6'], correctAnswer: 0 },
                    { id: 'q16', question: 'What is the solution to x² + x - 6 = 0?', options: ['-3, 2', '-2, 3', '1, -6', '6, -1'], correctAnswer: 0 },
                    { id: 'q17', question: 'Factor: x² - 2x - 8', options: ['(x - 4)(x + 2)', '(x + 4)(x - 2)', '(x - 8)(x + 1)', '(x + 8)(x - 1)'], correctAnswer: 0 },
                    { id: 'q18', question: 'What is the value of x in 4x + 8 = 0?', options: ['-2', '2', '-4', '4'], correctAnswer: 0 },
                    { id: 'q19', question: 'Expand: (x - 3)²', options: ['x² - 6x + 9', 'x² + 6x + 9', 'x² - 9x + 6', 'x² + 9x - 6'], correctAnswer: 0 },
                    { id: 'q20', question: 'What is the solution to x² = 16?', options: ['2', '-2', '4, -4', '8'], correctAnswer: 2 },
                ];
            } else if (isAdvanced) {
                generatedQuestions = [
                    { id: 'q1', question: 'Solve for x: x² - 5x + 6 = 0', options: ['1, 6', '2, 3', '3, 2', '6, 1'], correctAnswer: 1 },
                    { id: 'q2', question: 'If f(x) = 2x² - 3x + 1, what is f(2)?', options: ['3', '5', '7', '9'], correctAnswer: 2 },
                    { id: 'q3', question: 'What is the sum of the roots of x² - 7x + 10 = 0?', options: ['7', '10', '17', '3'], correctAnswer: 0 },
                    { id: 'q4', question: 'Factor completely: x³ - 8', options: ['(x - 2)(x² + 2x + 4)', '(x + 2)(x² - 2x + 4)', '(x - 2)(x² - 2x + 4)', '(x + 2)(x² + 2x + 4)'], correctAnswer: 0 },
                    { id: 'q5', question: 'If x + y = 10 and x - y = 2, what is x?', options: ['4', '5', '6', '8'], correctAnswer: 2 },
                    { id: 'q6', question: 'What is the discriminant of x² - 4x + 4 = 0?', options: ['0', '2', '4', '8'], correctAnswer: 0 },
                    { id: 'q7', question: 'Solve for x: 2x² - 8x = 0', options: ['0, 4', '2, -2', '0, -4', '4, -4'], correctAnswer: 0 },
                    { id: 'q8', question: 'If f(x) = x² - 2x + 1, what is the vertex?', options: ['(1, 0)', '(0, 1)', '(1, 1)', '(2, 1)'], correctAnswer: 0 },
                    { id: 'q9', question: 'What is the product of the roots of x² - 5x + 6 = 0?', options: ['5', '6', '11', '1'], correctAnswer: 1 },
                    { id: 'q10', question: 'Factor: x² - 2x - 15', options: ['(x - 5)(x + 3)', '(x + 5)(x - 3)', '(x - 3)(x + 5)', '(x + 3)(x - 5)'], correctAnswer: 0 },
                    { id: 'q11', question: 'If x² + y² = 25 and x = 3, what is y?', options: ['4', '-4', '5', '-5'], correctAnswer: 0 },
                    { id: 'q12', question: 'What is the axis of symmetry for y = x² - 6x + 5?', options: ['x = 3', 'x = 5', 'x = 6', 'x = 2'], correctAnswer: 0 },
                    { id: 'q13', question: 'Solve for x: x² + 2x + 1 = 0', options: ['-1', '1', '0', '2'], correctAnswer: 0 },
                    { id: 'q14', question: 'If f(x) = x³ - 3x² + 2x, what is f(1)?', options: ['0', '1', '2', '3'], correctAnswer: 0 },
                    { id: 'q15', question: 'What is the solution to x² - 9 = 0?', options: ['-3, 3', '0, 9', '3, 9', '-9, 9'], correctAnswer: 0 },
                    { id: 'q16', question: 'Factor: x² - 16', options: ['(x - 4)(x + 4)', '(x - 8)(x + 2)', '(x - 2)(x + 8)', '(x - 4)(x - 4)'], correctAnswer: 0 },
                    { id: 'q17', question: 'If x² - 4x + 3 = 0, what are the roots?', options: ['1, 3', '2, 3', '3, 4', '1, 4'], correctAnswer: 0 },
                    { id: 'q18', question: 'What is the value of x if x² = 100?', options: ['5', '10', '-10, 10', '100'], correctAnswer: 2 },
                    { id: 'q19', question: 'Expand: (x + 2)²', options: ['x² + 4x + 4', 'x² + 2x + 2', 'x² + 2x + 4', 'x² + 4x + 2'], correctAnswer: 0 },
                    { id: 'q20', question: 'What is the sum of the roots of x² - 8x + 15 = 0?', options: ['8', '15', '7', '23'], correctAnswer: 0 },
                ];
            }
        } else if (courseTitle.includes('Geometry')) {
            if (isBeginner) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the sum of the angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1 },
                    { id: 'q2', question: 'How many sides does a pentagon have?', options: ['4', '5', '6', '7'], correctAnswer: 1 },
                    { id: 'q3', question: 'What do you call a triangle with all sides equal?', options: ['Isosceles', 'Scalene', 'Equilateral', 'Right'], correctAnswer: 2 },
                    { id: 'q4', question: 'What is the name of a 6-sided polygon?', options: ['Pentagon', 'Hexagon', 'Heptagon', 'Octagon'], correctAnswer: 1 },
                    { id: 'q5', question: 'What is the area of a rectangle with length 8 and width 3?', options: ['11', '22', '24', '32'], correctAnswer: 2 },
                    { id: 'q6', question: 'What is the perimeter of a square with side 5?', options: ['10', '15', '20', '25'], correctAnswer: 2 },
                    { id: 'q7', question: 'How many degrees are in a right angle?', options: ['45°', '60°', '90°', '180°'], correctAnswer: 2 },
                    { id: 'q8', question: 'What is the name of a triangle with one angle of 90°?', options: ['Equilateral', 'Isosceles', 'Right', 'Obtuse'], correctAnswer: 2 },
                    { id: 'q9', question: 'What is the area of a triangle with base 6 and height 4?', options: ['10', '12', '14', '16'], correctAnswer: 1 },
                    { id: 'q10', question: 'What is the diameter of a circle with radius 7?', options: ['7', '14', '21', '28'], correctAnswer: 1 },
                    { id: 'q11', question: 'How many sides does a quadrilateral have?', options: ['3', '4', '5', '6'], correctAnswer: 1 },
                    { id: 'q12', question: 'What is the name of a polygon with 8 sides?', options: ['Hexagon', 'Heptagon', 'Octagon', 'Nonagon'], correctAnswer: 2 },
                    { id: 'q13', question: 'What is the length of the hypotenuse in a right triangle with legs 3 and 4?', options: ['5', '6', '7', '8'], correctAnswer: 0 },
                    { id: 'q14', question: 'What is the area of a square with side 9?', options: ['18', '27', '72', '81'], correctAnswer: 3 },
                    { id: 'q15', question: 'What is the sum of the angles in a quadrilateral?', options: ['180°', '270°', '360°', '540°'], correctAnswer: 2 },
                    { id: 'q16', question: 'What is the name of a triangle with all sides of different lengths?', options: ['Equilateral', 'Isosceles', 'Scalene', 'Right'], correctAnswer: 2 },
                    { id: 'q17', question: 'What is the area of a circle with radius 2? (Use π ≈ 3.14)', options: ['6.28', '9.42', '12.56', '3.14'], correctAnswer: 2 },
                    { id: 'q18', question: 'How many lines of symmetry does a square have?', options: ['2', '4', '6', '8'], correctAnswer: 1 },
                    { id: 'q19', question: 'What is the volume of a cube with side 3?', options: ['6', '9', '18', '27'], correctAnswer: 3 },
                    { id: 'q20', question: 'What is the measure of each angle in an equilateral triangle?', options: ['30°', '45°', '60°', '90°'], correctAnswer: 2 },
                ];
            } else if (isIntermediate) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the area of a parallelogram with base 10 and height 5?', options: ['15', '25', '50', '100'], correctAnswer: 2 },
                    { id: 'q2', question: 'What is the sum of the interior angles of a hexagon?', options: ['360°', '540°', '720°', '900°'], correctAnswer: 2 },
                    { id: 'q3', question: 'What is the length of the diagonal of a square with side 4? (Use √2 ≈ 1.41)', options: ['4', '5.66', '6', '8'], correctAnswer: 1 },
                    { id: 'q4', question: 'What is the area of a trapezoid with bases 6 and 10, and height 4?', options: ['16', '24', '32', '36'], correctAnswer: 1 },
                    { id: 'q5', question: 'What is the circumference of a circle with diameter 10? (Use π ≈ 3.14)', options: ['15.7', '31.4', '47.1', '62.8'], correctAnswer: 1 },
                    { id: 'q6', question: 'What is the volume of a rectangular prism with length 5, width 3, height 2?', options: ['10', '15', '20', '30'], correctAnswer: 3 },
                    { id: 'q7', question: 'What is the measure of each interior angle of a regular pentagon?', options: ['72°', '90°', '108°', '120°'], correctAnswer: 2 },
                    { id: 'q8', question: 'What is the area of a sector of a circle with radius 6 and angle 60°? (Use π ≈ 3.14)', options: ['6.28', '12.56', '18.84', '37.68'], correctAnswer: 1 },
                    { id: 'q9', question: 'What is the surface area of a cube with side 5?', options: ['25', '50', '100', '150'], correctAnswer: 2 },
                    { id: 'q10', question: 'What is the length of the median to the base of an isosceles triangle with base 8 and sides 10?', options: ['6', '8', '10', '12'], correctAnswer: 0 },
                    { id: 'q11', question: 'What is the area of a rhombus with diagonals 6 and 8?', options: ['12', '18', '24', '48'], correctAnswer: 2 },
                    { id: 'q12', question: 'What is the volume of a cylinder with radius 3 and height 7? (Use π ≈ 3.14)', options: ['65.94', '197.82', '205.8', '231'], correctAnswer: 0 },
                    { id: 'q13', question: 'What is the sum of the exterior angles of any polygon?', options: ['180°', '270°', '360°', '540°'], correctAnswer: 2 },
                    { id: 'q14', question: 'What is the area of an equilateral triangle with side 6? (Use √3 ≈ 1.73)', options: ['15.6', '18.7', '20.8', '23.4'], correctAnswer: 3 },
                    { id: 'q15', question: 'What is the length of the altitude of a triangle with base 10 and area 30?', options: ['3', '4', '5', '6'], correctAnswer: 2 },
                    { id: 'q16', question: 'What is the measure of the largest angle in a right triangle with legs 5 and 12?', options: ['37°', '53°', '90°', '127°'], correctAnswer: 2 },
                    { id: 'q17', question: 'What is the area of a circle with diameter 8? (Use π ≈ 3.14)', options: ['25.12', '50.24', '12.56', '32.16'], correctAnswer: 0 },
                    { id: 'q18', question: 'What is the volume of a sphere with radius 2? (Use π ≈ 3.14)', options: ['16.76', '25.12', '33.49', '50.24'], correctAnswer: 2 },
                    { id: 'q19', question: 'What is the area of a regular hexagon with side 4? (Use √3 ≈ 1.73)', options: ['24.8', '41.6', '16.6', '27.7'], correctAnswer: 0 },
                    { id: 'q20', question: 'What is the sum of the angles in a pentagon?', options: ['360°', '540°', '720°', '900°'], correctAnswer: 1 },
                ];
            } else if (isAdvanced) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the area of a triangle with sides 7, 8, and 9? (Use Heron\'s formula)', options: ['24', '26.83', '28', '30.5'], correctAnswer: 1 },
                    { id: 'q2', question: 'What is the volume of a cone with radius 3 and height 9? (Use π ≈ 3.14)', options: ['28.26', '84.78', '113.04', '254.34'], correctAnswer: 0 },
                    { id: 'q3', question: 'What is the length of the diagonal of a rectangle with sides 9 and 12?', options: ['12', '13', '14', '15'], correctAnswer: 3 },
                    { id: 'q4', question: 'What is the area of a sector of a circle with radius 10 and angle 45°? (Use π ≈ 3.14)', options: ['19.63', '39.25', '78.5', '157'], correctAnswer: 0 },
                    { id: 'q5', question: 'What is the surface area of a sphere with radius 5? (Use π ≈ 3.14)', options: ['78.5', '157', '314', '392.5'], correctAnswer: 2 },
                    { id: 'q6', question: 'What is the area of a regular octagon with side 6? (Use 2(1+√2)s², √2 ≈ 1.41)', options: ['72', '96', '116.6', '144'], correctAnswer: 2 },
                    { id: 'q7', question: 'What is the volume of a pyramid with base area 20 and height 15?', options: ['50', '75', '100', '150'], correctAnswer: 1 },
                    { id: 'q8', question: 'What is the area of an ellipse with axes 6 and 4? (Use π ≈ 3.14)', options: ['24', '48', '75.36', '100.48'], correctAnswer: 2 },
                    { id: 'q9', question: 'What is the length of the side of a square with diagonal 10? (Use √2 ≈ 1.41)', options: ['5.5', '6.2', '7.1', '7.07'], correctAnswer: 3 },
                    { id: 'q10', question: 'What is the area of a triangle with base 10 and height 12?', options: ['40', '50', '60', '70'], correctAnswer: 2 },
                    { id: 'q11', question: 'What is the volume of a cylinder with radius 4 and height 10? (Use π ≈ 3.14)', options: ['125.6', '251.2', '314', '502.4'], correctAnswer: 1 },
                    { id: 'q12', question: 'What is the area of a parallelogram with sides 8 and 10 and included angle 60°? (Use sin 60° ≈ 0.87)', options: ['40', '60', '69.6', '80'], correctAnswer: 2 },
                    { id: 'q13', question: 'What is the surface area of a cube with side 7?', options: ['196', '294', '343', '392'], correctAnswer: 1 },
                    { id: 'q14', question: 'What is the area of a regular pentagon with side 5? (Use 1.72 × s²)', options: ['25', '35', '43', '50'], correctAnswer: 2 },
                    { id: 'q15', question: 'What is the volume of a sphere with radius 6? (Use π ≈ 3.14)', options: ['452.16', '904.32', '113.04', '226.08'], correctAnswer: 0 },
                    { id: 'q16', question: 'What is the area of a triangle with sides 13, 14, and 15? (Use Heron\'s formula)', options: ['72', '84', '90', '100'], correctAnswer: 1 },
                    { id: 'q17', question: 'What is the length of the median to the base of a triangle with sides 10, 10, and 12?', options: ['6', '7', '8', '9'], correctAnswer: 2 },
                    { id: 'q18', question: 'What is the area of a sector of a circle with radius 12 and angle 120°? (Use π ≈ 3.14)', options: ['50.24', '75.36', '150.72', '226.08'], correctAnswer: 1 },
                    { id: 'q19', question: 'What is the volume of a cone with base radius 5 and height 15? (Use π ≈ 3.14)', options: ['125.6', '392.5', '785', '1177.5'], correctAnswer: 0 },
                    { id: 'q20', question: 'What is the sum of the angles in a decagon?', options: ['1440°', '1620°', '1800°', '1980°'], correctAnswer: 0 },
                ];
            }
        }
    } else if (subject === 'Physics') {
        if (courseTitle.includes('Mechanics')) {
            if (isBeginner) {
                generatedQuestions = [
                    { id: 'q1', question: 'Which of the following is NOT a fundamental unit in mechanics?', options: ['Meter', 'Second', 'Newton', 'Kilogram'], correctAnswer: 2 },
                    { id: 'q2', question: 'A car travels 60 km in 2 hours. What is its average speed in m/s?', options: ['8.33 m/s', '10 m/s', '12 m/s', '15 m/s'], correctAnswer: 0 },
                    { id: 'q3', question: 'What happens to the acceleration of an object when the net force acting on it is doubled?', options: ['It remains the same', 'It doubles', 'It halves', 'It quadruples'], correctAnswer: 1 },
                    { id: 'q4', question: 'Which of the following is an example of a vector quantity?', options: ['Time', 'Temperature', 'Displacement', 'Speed'], correctAnswer: 2 },
                    { id: 'q5', question: 'A ball is thrown vertically upward. What happens to its velocity at the highest point?', options: ['It is maximum', 'It is zero', 'It is negative', 'It is constant'], correctAnswer: 1 },
                    { id: 'q6', question: 'What is the SI unit of work?', options: ['Newton', 'Joule', 'Watt', 'Pascal'], correctAnswer: 1 },
                    { id: 'q7', question: 'Which law states that "Every action has an equal and opposite reaction"?', options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'], correctAnswer: 2 },
                    { id: 'q8', question: 'A force of 10 N acts on a mass of 2 kg. What is the acceleration?', options: ['2 m/s²', '5 m/s²', '10 m/s²', '20 m/s²'], correctAnswer: 1 },
                    { id: 'q9', question: 'What is the relationship between mass and weight?', options: ['They are the same', 'Weight is mass times acceleration', 'Weight is mass times gravity', 'Mass is weight times gravity'], correctAnswer: 2 },
                    { id: 'q10', question: 'Which of the following is a scalar quantity?', options: ['Force', 'Velocity', 'Distance', 'Acceleration'], correctAnswer: 2 },
                    { id: 'q11', question: 'What is the principle of conservation of energy?', options: ['Energy can be created', 'Energy can be destroyed', 'Energy cannot be created or destroyed', 'Energy is always constant'], correctAnswer: 2 },
                    { id: 'q12', question: 'A ball is dropped from a height of 20m. What is its velocity just before hitting the ground? (g = 10 m/s²)', options: ['10 m/s', '14.14 m/s', '20 m/s', '40 m/s'], correctAnswer: 1 },
                    { id: 'q13', question: 'What is the difference between speed and velocity?', options: ['There is no difference', 'Velocity includes direction', 'Speed is always greater', 'Velocity is always greater'], correctAnswer: 1 },
                    { id: 'q14', question: 'Which of the following is an example of potential energy?', options: ['A moving car', 'A stretched spring', 'A flowing river', 'A rotating wheel'], correctAnswer: 1 },
                    { id: 'q15', question: 'What is the relationship between force and acceleration?', options: ['They are inversely proportional', 'They are directly proportional', 'They are unrelated', 'They are equal'], correctAnswer: 1 },
                    { id: 'q16', question: 'A force of 5 N is applied to move an object 3 meters. What is the work done?', options: ['5 J', '8 J', '15 J', '20 J'], correctAnswer: 2 },
                    { id: 'q17', question: 'What is the SI unit of power?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correctAnswer: 2 },
                    { id: 'q18', question: 'Which of the following is NOT a type of friction?', options: ['Static', 'Kinetic', 'Rolling', 'Gravitational'], correctAnswer: 3 },
                    { id: 'q19', question: 'What is the principle of conservation of momentum?', options: ['Momentum can be created', 'Momentum can be destroyed', 'Total momentum remains constant', 'Momentum is always zero'], correctAnswer: 2 },
                    { id: 'q20', question: 'A car accelerates from rest to 20 m/s in 5 seconds. What is its acceleration?', options: ['2 m/s²', '4 m/s²', '5 m/s²', '10 m/s²'], correctAnswer: 1 },
                ];
            } else if (isIntermediate) {
                generatedQuestions = [
                    { id: 'q1', question: 'A projectile is launched at 45° to the horizontal. What is true about its horizontal and vertical components of velocity?', options: ['They are equal', 'Horizontal is greater', 'Vertical is greater', 'They are unrelated'], correctAnswer: 0 },
                    { id: 'q2', question: 'What is the work done by a force F = 2x + 3 acting on an object moving from x = 0 to x = 4?', options: ['8 J', '16 J', '20 J', '24 J'], correctAnswer: 2 },
                    { id: 'q3', question: 'A block slides down a frictionless inclined plane. What happens to its acceleration if the angle is doubled?', options: ['It doubles', 'It halves', 'It increases but not doubles', 'It decreases but not halves'], correctAnswer: 2 },
                    { id: 'q4', question: 'What is the relationship between angular velocity and linear velocity?', options: ['They are equal', 'v = rω', 'ω = rv', 'They are unrelated'], correctAnswer: 1 },
                    { id: 'q5', question: 'A spring with constant k = 100 N/m is compressed by 0.1 m. What is the potential energy stored?', options: ['0.5 J', '1 J', '2 J', '5 J'], correctAnswer: 0 },
                    { id: 'q6', question: 'What is the condition for a body to be in equilibrium?', options: ['Net force is zero', 'Net torque is zero', 'Both A and B', 'Either A or B'], correctAnswer: 2 },
                    { id: 'q7', question: 'A car moves in a circular path with constant speed. What is true about its acceleration?', options: ['It is zero', 'It is constant', 'It is directed towards the center', 'It is directed away from the center'], correctAnswer: 2 },
                    { id: 'q8', question: 'What is the relationship between impulse and momentum?', options: ['They are equal', 'Impulse is change in momentum', 'Momentum is change in impulse', 'They are unrelated'], correctAnswer: 1 },
                    { id: 'q9', question: 'A force F = 3i + 4j N acts on an object. What is the magnitude of the force?', options: ['5 N', '7 N', '12 N', '25 N'], correctAnswer: 0 },
                    { id: 'q10', question: 'What is the condition for a body to be in static equilibrium?', options: ['Net force is zero', 'Net torque is zero', 'Both A and B', 'Either A or B'], correctAnswer: 2 },
                    { id: 'q11', question: 'A ball is thrown at an angle θ to the horizontal. What is the range if the initial velocity is doubled?', options: ['It doubles', 'It quadruples', 'It remains the same', 'It halves'], correctAnswer: 1 },
                    { id: 'q12', question: 'What is the relationship between power and work?', options: ['They are equal', 'Power is work per unit time', 'Work is power per unit time', 'They are unrelated'], correctAnswer: 1 },
                    { id: 'q13', question: 'A body moves with constant angular velocity. What is true about its linear velocity?', options: ['It is constant', 'It varies with radius', 'It is zero', 'It is maximum'], correctAnswer: 1 },
                    { id: 'q14', question: 'What is the condition for a body to be in dynamic equilibrium?', options: ['Net force is zero', 'Net torque is zero', 'Both A and B', 'Either A or B'], correctAnswer: 2 },
                    { id: 'q15', question: 'A force F = 2x² N acts on an object. What is the work done from x = 0 to x = 2?', options: ['2 J', '4 J', '8 J', '16 J'], correctAnswer: 2 },
                    { id: 'q16', question: 'What is the relationship between torque and angular acceleration?', options: ['They are equal', 'They are inversely proportional', 'They are directly proportional', 'They are unrelated'], correctAnswer: 2 },
                    { id: 'q17', question: 'A body moves in a circular path with constant angular velocity. What is true about its tangential acceleration?', options: ['It is constant', 'It is zero', 'It varies with radius', 'It is maximum'], correctAnswer: 1 },
                    { id: 'q18', question: 'What is the condition for a body to be in rotational equilibrium?', options: ['Net force is zero', 'Net torque is zero', 'Both A and B', 'Either A or B'], correctAnswer: 1 },
                    { id: 'q19', question: 'A force F = 3x + 2 N acts on an object. What is the work done from x = 1 to x = 3?', options: ['8 J', '12 J', '16 J', '20 J'], correctAnswer: 2 },
                    { id: 'q20', question: 'What is the relationship between angular momentum and torque?', options: ['They are equal', 'Torque is rate of change of angular momentum', 'Angular momentum is rate of change of torque', 'They are unrelated'], correctAnswer: 1 },
                ];
            } else if (isAdvanced) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the Lagrangian of a simple harmonic oscillator?', options: ['L = T - V', 'L = T + V', 'L = T × V', 'L = T/V'], correctAnswer: 0 },
                    { id: 'q2', question: 'What is the condition for a system to be in stable equilibrium?', options: ['Potential energy is minimum', 'Potential energy is maximum', 'Kinetic energy is minimum', 'Kinetic energy is maximum'], correctAnswer: 0 },
                    { id: 'q3', question: 'What is the relationship between the moment of inertia and angular momentum?', options: ['They are equal', 'L = Iω', 'I = Lω', 'They are unrelated'], correctAnswer: 1 },
                    { id: 'q4', question: 'What is the principle of least action?', options: ['Action is always minimum', 'Action is always maximum', 'Action is always zero', 'Action is always constant'], correctAnswer: 0 },
                    { id: 'q5', question: 'What is the relationship between the Hamiltonian and total energy?', options: ['They are equal', 'H = T + V', 'H = T - V', 'H = T × V'], correctAnswer: 1 },
                    { id: 'q6', question: 'What is the condition for a system to be in unstable equilibrium?', options: ['Potential energy is minimum', 'Potential energy is maximum', 'Kinetic energy is minimum', 'Kinetic energy is maximum'], correctAnswer: 1 },
                    { id: 'q7', question: 'What is the relationship between the angular velocity and the moment of inertia?', options: ['They are equal', 'They are inversely proportional', 'They are directly proportional', 'They are unrelated'], correctAnswer: 1 },
                    { id: 'q8', question: 'What is the principle of virtual work?', options: ['Work is always minimum', 'Work is always maximum', 'Work is always zero', 'Work is always constant'], correctAnswer: 2 },
                    { id: 'q9', question: 'What is the relationship between the Lagrangian and the Hamiltonian?', options: ['They are equal', 'H = L + T', 'H = L - T', 'H = L × T'], correctAnswer: 1 },
                    { id: 'q10', question: 'What is the condition for a system to be in neutral equilibrium?', options: ['Potential energy is minimum', 'Potential energy is maximum', 'Potential energy is constant', 'Potential energy is zero'], correctAnswer: 2 },
                    { id: 'q11', question: 'What is the relationship between the angular momentum and the moment of inertia?', options: ['They are equal', 'L = Iω', 'I = Lω', 'They are unrelated'], correctAnswer: 1 },
                    { id: 'q12', question: 'What is the principle of conservation of angular momentum?', options: ['Angular momentum can be created', 'Angular momentum can be destroyed', 'Total angular momentum remains constant', 'Angular momentum is always zero'], correctAnswer: 2 },
                    { id: 'q13', question: 'What is the relationship between the Hamiltonian and the Lagrangian?', options: ['They are equal', 'H = L + T', 'H = L - T', 'H = L × T'], correctAnswer: 1 },
                    { id: 'q14', question: 'What is the condition for a system to be in stable equilibrium?', options: ['Potential energy is minimum', 'Potential energy is maximum', 'Kinetic energy is minimum', 'Kinetic energy is maximum'], correctAnswer: 0 },
                    { id: 'q15', question: 'What is the relationship between the angular velocity and the angular momentum?', options: ['They are equal', 'L = Iω', 'ω = L/I', 'They are unrelated'], correctAnswer: 2 },
                    { id: 'q16', question: 'What is the principle of conservation of energy?', options: ['Energy can be created', 'Energy can be destroyed', 'Total energy remains constant', 'Energy is always zero'], correctAnswer: 2 },
                    { id: 'q17', question: 'What is the relationship between the moment of inertia and the angular acceleration?', options: ['They are equal', 'They are inversely proportional', 'They are directly proportional', 'They are unrelated'], correctAnswer: 1 },
                    { id: 'q18', question: 'What is the principle of conservation of momentum?', options: ['Momentum can be created', 'Momentum can be destroyed', 'Total momentum remains constant', 'Momentum is always zero'], correctAnswer: 2 },
                    { id: 'q19', question: 'What is the relationship between the Hamiltonian and the total energy?', options: ['They are equal', 'H = T + V', 'H = T - V', 'H = T × V'], correctAnswer: 1 },
                    { id: 'q20', question: 'What is the condition for a system to be in unstable equilibrium?', options: ['Potential energy is minimum', 'Potential energy is maximum', 'Kinetic energy is minimum', 'Kinetic energy is maximum'], correctAnswer: 1 },
                ];
            }
        } else if (courseTitle.includes('Thermodynamics')) {
            if (isBeginner) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the SI unit of temperature?', options: ['Celsius', 'Fahrenheit', 'Kelvin', 'Rankine'], correctAnswer: 2 },
                    { id: 'q2', question: 'Which of the following is NOT a state variable?', options: ['Temperature', 'Pressure', 'Work', 'Volume'], correctAnswer: 2 },
                    { id: 'q3', question: 'What happens to the volume of a gas when its temperature increases at constant pressure?', options: ['It decreases', 'It increases', 'It remains constant', 'It becomes zero'], correctAnswer: 1 },
                    { id: 'q4', question: 'Which law states that the pressure of a gas is inversely proportional to its volume at constant temperature?', options: ['First Law', 'Second Law', 'Boyle\'s Law', 'Charles\' Law'], correctAnswer: 2 },
                    { id: 'q5', question: 'What is the relationship between Celsius and Kelvin temperature scales?', options: ['K = C + 273', 'K = C - 273', 'K = C × 273', 'K = C ÷ 273'], correctAnswer: 0 },
                    { id: 'q6', question: 'Which of the following is an example of heat transfer by conduction?', options: ['Boiling water', 'Sunlight warming Earth', 'Metal spoon in hot soup', 'Hot air rising'], correctAnswer: 2 },
                    { id: 'q7', question: 'What is the specific heat capacity of water in J/kg·K?', options: ['1000', '2000', '3000', '4200'], correctAnswer: 3 },
                    { id: 'q8', question: 'Which process occurs at constant temperature?', options: ['Adiabatic', 'Isobaric', 'Isothermal', 'Isochoric'], correctAnswer: 2 },
                    { id: 'q9', question: 'What is the first law of thermodynamics?', options: ['Energy cannot be created or destroyed', 'Heat flows from hot to cold', 'Entropy always increases', 'Pressure is constant'], correctAnswer: 0 },
                    { id: 'q10', question: 'Which of the following is a unit of heat?', options: ['Newton', 'Pascal', 'Joule', 'Watt'], correctAnswer: 2 },
                    { id: 'q11', question: 'What happens to the pressure of a gas when its volume decreases at constant temperature?', options: ['It decreases', 'It increases', 'It remains constant', 'It becomes zero'], correctAnswer: 1 },
                    { id: 'q12', question: 'Which of the following is an example of heat transfer by convection?', options: ['Ice melting', 'Metal heating up', 'Hot air rising', 'Sunlight warming'], correctAnswer: 2 },
                    { id: 'q13', question: 'What is the relationship between pressure and volume in an isothermal process?', options: ['Directly proportional', 'Inversely proportional', 'No relationship', 'Exponential'], correctAnswer: 1 },
                    { id: 'q14', question: 'Which of the following is NOT a method of heat transfer?', options: ['Conduction', 'Convection', 'Radiation', 'Reflection'], correctAnswer: 3 },
                    { id: 'q15', question: 'What is the unit of thermal conductivity?', options: ['W/m·K', 'J/kg·K', 'K/W', 'W/K'], correctAnswer: 0 },
                    { id: 'q16', question: 'Which process occurs at constant pressure?', options: ['Adiabatic', 'Isobaric', 'Isothermal', 'Isochoric'], correctAnswer: 1 },
                    { id: 'q17', question: 'What is the relationship between temperature and volume in an isobaric process?', options: ['Directly proportional', 'Inversely proportional', 'No relationship', 'Exponential'], correctAnswer: 0 },
                    { id: 'q18', question: 'Which of the following is an example of heat transfer by radiation?', options: ['Boiling water', 'Metal heating up', 'Hot air rising', 'Sunlight warming'], correctAnswer: 3 },
                    { id: 'q19', question: 'What is the unit of heat capacity?', options: ['J/K', 'K/J', 'J/kg', 'kg/K'], correctAnswer: 0 },
                    { id: 'q20', question: 'Which process occurs at constant volume?', options: ['Adiabatic', 'Isobaric', 'Isothermal', 'Isochoric'], correctAnswer: 3 },
                ];
            } else if (isIntermediate) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the work done by a gas expanding isothermally from V₁ to V₂?', options: ['P(V₂-V₁)', 'nRT ln(V₂/V₁)', 'P(V₂+V₁)', 'nRT(V₂-V₁)'], correctAnswer: 1 },
                    { id: 'q2', question: 'What is the efficiency of a Carnot engine operating between temperatures T₁ and T₂?', options: ['1 - T₂/T₁', 'T₂/T₁', '1 - T₁/T₂', 'T₁/T₂'], correctAnswer: 0 },
                    { id: 'q3', question: 'What is the change in entropy for an isothermal process?', options: ['Zero', 'nR ln(V₂/V₁)', 'nR(T₂-T₁)', 'nR ln(T₂/T₁)'], correctAnswer: 1 },
                    { id: 'q4', question: 'What is the relationship between heat capacity at constant pressure (Cp) and constant volume (Cv)?', options: ['Cp = Cv', 'Cp = Cv + R', 'Cp = Cv - R', 'Cp = Cv × R'], correctAnswer: 1 },
                    { id: 'q5', question: 'What is the work done in an adiabatic process?', options: ['Zero', 'PΔV', 'nRΔT', 'CvΔT'], correctAnswer: 3 },
                    { id: 'q6', question: 'What is the change in internal energy for an ideal gas in an isothermal process?', options: ['Zero', 'nRΔT', 'PΔV', 'CvΔT'], correctAnswer: 0 },
                    { id: 'q7', question: 'What is the relationship between pressure and temperature in an isochoric process?', options: ['Directly proportional', 'Inversely proportional', 'No relationship', 'Exponential'], correctAnswer: 0 },
                    { id: 'q8', question: 'What is the heat transfer in an adiabatic process?', options: ['Zero', 'nRΔT', 'PΔV', 'CvΔT'], correctAnswer: 0 },
                    { id: 'q9', question: 'What is the change in enthalpy for an ideal gas in an isothermal process?', options: ['Zero', 'nRΔT', 'PΔV', 'CpΔT'], correctAnswer: 0 },
                    { id: 'q10', question: 'What is the work done in an isochoric process?', options: ['Zero', 'PΔV', 'nRΔT', 'CvΔT'], correctAnswer: 0 },
                    { id: 'q11', question: 'What is the relationship between volume and temperature in an adiabatic process?', options: ['TV^(γ-1) = constant', 'TV = constant', 'T/V = constant', 'T²V = constant'], correctAnswer: 0 },
                    { id: 'q12', question: 'What is the change in entropy for an adiabatic process?', options: ['Zero', 'nR ln(V₂/V₁)', 'nR(T₂-T₁)', 'nR ln(T₂/T₁)'], correctAnswer: 0 },
                    { id: 'q13', question: 'What is the heat transfer in an isothermal process?', options: ['Zero', 'nRΔT', 'nRT ln(V₂/V₁)', 'CvΔT'], correctAnswer: 2 },
                    { id: 'q14', question: 'What is the relationship between pressure and volume in an adiabatic process?', options: ['PV = constant', 'PV^γ = constant', 'P/V = constant', 'P²V = constant'], correctAnswer: 1 },
                    { id: 'q15', question: 'What is the change in internal energy for an ideal gas in an isochoric process?', options: ['Zero', 'nRΔT', 'PΔV', 'CvΔT'], correctAnswer: 3 },
                    { id: 'q16', question: 'What is the work done in an isobaric process?', options: ['Zero', 'PΔV', 'nRΔT', 'CvΔT'], correctAnswer: 1 },
                    { id: 'q17', question: 'What is the heat transfer in an isochoric process?', options: ['Zero', 'nRΔT', 'PΔV', 'CvΔT'], correctAnswer: 3 },
                    { id: 'q18', question: 'What is the change in enthalpy for an ideal gas in an isochoric process?', options: ['Zero', 'nRΔT', 'PΔV', 'CpΔT'], correctAnswer: 3 },
                    { id: 'q19', question: 'What is the relationship between pressure and temperature in an adiabatic process?', options: ['PT^(γ-1) = constant', 'PT = constant', 'P/T = constant', 'P²T = constant'], correctAnswer: 0 },
                    { id: 'q20', question: 'What is the change in entropy for an isochoric process?', options: ['Zero', 'nR ln(V₂/V₁)', 'nR(T₂-T₁)', 'Cv ln(T₂/T₁)'], correctAnswer: 3 },
                ];
            } else if (isAdvanced) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the relationship between the Helmholtz free energy and the partition function?', options: ['F = -kT ln Z', 'F = kT ln Z', 'F = -kT/Z', 'F = kT/Z'], correctAnswer: 0 },
                    { id: 'q2', question: 'What is the condition for a system to be in thermodynamic equilibrium?', options: ['Minimum free energy', 'Maximum entropy', 'Both A and B', 'Either A or B'], correctAnswer: 2 },
                    { id: 'q3', question: 'What is the relationship between the Gibbs free energy and the chemical potential?', options: ['G = μN', 'G = -μN', 'G = μ/N', 'G = N/μ'], correctAnswer: 0 },
                    { id: 'q4', question: 'What is the condition for a phase transition to occur?', options: ['Equal free energies', 'Equal entropies', 'Equal temperatures', 'Equal pressures'], correctAnswer: 0 },
                    { id: 'q5', question: 'What is the relationship between the partition function and the internal energy?', options: ['U = -∂lnZ/∂β', 'U = ∂lnZ/∂β', 'U = -β∂lnZ/∂β', 'U = β∂lnZ/∂β'], correctAnswer: 2 },
                    { id: 'q6', question: 'What is the condition for a system to be in stable equilibrium?', options: ['Minimum free energy', 'Maximum entropy', 'Both A and B', 'Either A or B'], correctAnswer: 2 },
                    { id: 'q7', question: 'What is the relationship between the chemical potential and the partition function?', options: ['μ = -kT ∂lnZ/∂N', 'μ = kT ∂lnZ/∂N', 'μ = -kT/Z', 'μ = kT/Z'], correctAnswer: 0 },
                    { id: 'q8', question: 'What is the condition for a system to be in unstable equilibrium?', options: ['Maximum free energy', 'Minimum entropy', 'Both A and B', 'Either A or B'], correctAnswer: 2 },
                    { id: 'q9', question: 'What is the relationship between the Helmholtz free energy and the internal energy?', options: ['F = U - TS', 'F = U + TS', 'F = U/T - S', 'F = U/T + S'], correctAnswer: 0 },
                    { id: 'q10', question: 'What is the condition for a system to be in neutral equilibrium?', options: ['Constant free energy', 'Constant entropy', 'Both A and B', 'Either A or B'], correctAnswer: 2 },
                    { id: 'q11', question: 'What is the relationship between the partition function and the entropy?', options: ['S = k(lnZ + βU)', 'S = k(lnZ - βU)', 'S = k(lnZ + U/β)', 'S = k(lnZ - U/β)'], correctAnswer: 0 },
                    { id: 'q12', question: 'What is the condition for a system to be in metastable equilibrium?', options: ['Local minimum free energy', 'Local maximum entropy', 'Both A and B', 'Either A or B'], correctAnswer: 2 },
                    { id: 'q13', question: 'What is the relationship between the Gibbs free energy and the partition function?', options: ['G = -kT ln Z', 'G = kT ln Z', 'G = -kT/Z', 'G = kT/Z'], correctAnswer: 0 },
                    { id: 'q14', question: 'What is the condition for a system to be in critical equilibrium?', options: ['Equal free energies', 'Equal entropies', 'Equal temperatures', 'Equal pressures'], correctAnswer: 0 },
                    { id: 'q15', question: 'What is the relationship between the chemical potential and the Gibbs free energy?', options: ['μ = ∂G/∂N', 'μ = -∂G/∂N', 'μ = G/N', 'μ = N/G'], correctAnswer: 0 },
                    { id: 'q16', question: 'What is the condition for a system to be in phase equilibrium?', options: ['Equal chemical potentials', 'Equal temperatures', 'Equal pressures', 'All of the above'], correctAnswer: 3 },
                    { id: 'q17', question: 'What is the relationship between the partition function and the heat capacity?', options: ['Cv = kβ²∂²lnZ/∂β²', 'Cv = -kβ²∂²lnZ/∂β²', 'Cv = k/β²∂²lnZ/∂β²', 'Cv = -k/β²∂²lnZ/∂β²'], correctAnswer: 0 },
                    { id: 'q18', question: 'What is the condition for a system to be in thermal equilibrium?', options: ['Equal temperatures', 'Equal pressures', 'Equal volumes', 'Equal entropies'], correctAnswer: 0 },
                    { id: 'q19', question: 'What is the relationship between the Helmholtz free energy and the partition function?', options: ['F = -kT ln Z', 'F = kT ln Z', 'F = -kT/Z', 'F = kT/Z'], correctAnswer: 0 },
                    { id: 'q20', question: 'What is the condition for a system to be in mechanical equilibrium?', options: ['Equal pressures', 'Equal temperatures', 'Equal volumes', 'Equal entropies'], correctAnswer: 0 },
                ];
            }
        } else if (courseTitle.includes('Electricity and Magnetism')) {
            if (isBeginner) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the SI unit of electric current?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correctAnswer: 1 },
                    { id: 'q2', question: 'Which of the following is a unit of electric potential difference?', options: ['Ampere', 'Ohm', 'Volt', 'Watt'], correctAnswer: 2 },
                    { id: 'q3', question: 'What is the relationship between current and voltage in a conductor?', options: ['Directly proportional', 'Inversely proportional', 'No relationship', 'Exponential'], correctAnswer: 0 },
                    { id: 'q4', question: 'Which of the following is NOT a type of electric charge?', options: ['Positive', 'Negative', 'Neutral', 'Magnetic'], correctAnswer: 3 },
                    { id: 'q5', question: 'What is the SI unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correctAnswer: 2 },
                    { id: 'q6', question: 'Which of the following is a good conductor of electricity?', options: ['Rubber', 'Wood', 'Copper', 'Plastic'], correctAnswer: 2 },
                    { id: 'q7', question: 'What is the direction of conventional current flow?', options: ['Negative to positive', 'Positive to negative', 'Both directions', 'No direction'], correctAnswer: 1 },
                    { id: 'q8', question: 'What is the relationship between power and current?', options: ['P = I × V', 'P = I/V', 'P = V/I', 'P = I + V'], correctAnswer: 0 },
                    { id: 'q9', question: 'Which of the following is a unit of electrical power?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correctAnswer: 3 },
                    { id: 'q10', question: 'What is the purpose of a fuse in an electrical circuit?', options: ['To increase current', 'To decrease voltage', 'To protect from overcurrent', 'To store energy'], correctAnswer: 2 },
                    { id: 'q11', question: 'What is the relationship between voltage and current in a resistor?', options: ['V = IR', 'V = I/R', 'V = R/I', 'V = I + R'], correctAnswer: 0 },
                    { id: 'q12', question: 'Which of the following is a unit of electrical energy?', options: ['Volt', 'Ampere', 'Ohm', 'Joule'], correctAnswer: 3 },
                    { id: 'q13', question: 'What is the purpose of a switch in an electrical circuit?', options: ['To increase current', 'To decrease voltage', 'To control current flow', 'To store energy'], correctAnswer: 2 },
                    { id: 'q14', question: 'Which of the following is a good insulator?', options: ['Copper', 'Aluminum', 'Rubber', 'Iron'], correctAnswer: 2 },
                    { id: 'q15', question: 'What is the relationship between current and resistance?', options: ['Directly proportional', 'Inversely proportional', 'No relationship', 'Exponential'], correctAnswer: 1 },
                    { id: 'q16', question: 'What is the purpose of a battery in a circuit?', options: ['To increase resistance', 'To decrease current', 'To provide voltage', 'To store charge'], correctAnswer: 2 },
                    { id: 'q17', question: 'Which of the following is a unit of electrical charge?', options: ['Volt', 'Ampere', 'Coulomb', 'Watt'], correctAnswer: 2 },
                    { id: 'q18', question: 'What is the relationship between power and voltage?', options: ['P = V × I', 'P = V/I', 'P = I/V', 'P = V + I'], correctAnswer: 0 },
                    { id: 'q19', question: 'Which of the following is a type of electrical circuit?', options: ['Series', 'Parallel', 'Both A and B', 'Neither A nor B'], correctAnswer: 2 },
                    { id: 'q20', question: 'What is the purpose of a resistor in a circuit?', options: ['To increase current', 'To decrease voltage', 'To limit current', 'To store energy'], correctAnswer: 2 },
                ];
            } else if (isIntermediate) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the relationship between current and voltage in a capacitor?', options: ['I = C dV/dt', 'I = V/C', 'I = CV', 'I = C/V'], correctAnswer: 0 },
                    { id: 'q2', question: 'What is the relationship between current and voltage in an inductor?', options: ['V = L dI/dt', 'V = I/L', 'V = LI', 'V = L/I'], correctAnswer: 0 },
                    { id: 'q3', question: 'What is the relationship between power and resistance?', options: ['P = I²R', 'P = R/I²', 'P = I/R²', 'P = R²/I'], correctAnswer: 0 },
                    { id: 'q4', question: 'What is the relationship between voltage and current in an AC circuit?', options: ['V = IZ', 'V = I/Z', 'V = Z/I', 'V = I + Z'], correctAnswer: 0 },
                    { id: 'q5', question: 'What is the relationship between current and voltage in a transformer?', options: ['V₁/V₂ = N₁/N₂', 'V₁/V₂ = N₂/N₁', 'V₁/V₂ = N₁N₂', 'V₁/V₂ = 1/(N₁N₂)'], correctAnswer: 0 },
                    { id: 'q6', question: 'What is the relationship between power and current in an AC circuit?', options: ['P = VI cos(θ)', 'P = VI sin(θ)', 'P = VI tan(θ)', 'P = VI cot(θ)'], correctAnswer: 0 },
                    { id: 'q7', question: 'What is the relationship between voltage and current in a series circuit?', options: ['V = V₁ + V₂ + ...', 'V = V₁ = V₂ = ...', 'V = V₁ × V₂ × ...', 'V = V₁/V₂/...'], correctAnswer: 0 },
                    { id: 'q8', question: 'What is the relationship between current and voltage in a parallel circuit?', options: ['I = I₁ + I₂ + ...', 'I = I₁ = I₂ = ...', 'I = I₁ × I₂ × ...', 'I = I₁/I₂/...'], correctAnswer: 0 },
                    { id: 'q9', question: 'What is the relationship between resistance and temperature?', options: ['R = R₀(1 + αΔT)', 'R = R₀(1 - αΔT)', 'R = R₀(1 + α/T)', 'R = R₀(1 - α/T)'], correctAnswer: 0 },
                    { id: 'q10', question: 'What is the relationship between power and energy?', options: ['P = dE/dt', 'P = E/t', 'P = t/E', 'P = E × t'], correctAnswer: 0 },
                    { id: 'q11', question: 'What is the relationship between voltage and current in a diode?', options: ['I = I₀(e^(V/Vₜ) - 1)', 'I = I₀(1 - e^(V/Vₜ))', 'I = I₀(e^(-V/Vₜ) - 1)', 'I = I₀(1 - e^(-V/Vₜ))'], correctAnswer: 0 },
                    { id: 'q12', question: 'What is the relationship between current and voltage in a transistor?', options: ['I = I₀(e^(V/Vₜ) - 1)', 'I = I₀(1 - e^(V/Vₜ))', 'I = I₀(e^(-V/Vₜ) - 1)', 'I = I₀(1 - e^(-V/Vₜ))'], correctAnswer: 0 },
                    { id: 'q13', question: 'What is the relationship between power and voltage in an AC circuit?', options: ['P = V²/R', 'P = R/V²', 'P = V²R', 'P = V/R²'], correctAnswer: 0 },
                    { id: 'q14', question: 'What is the relationship between current and voltage in an op-amp?', options: ['V = A(V₊ - V₋)', 'V = A(V₋ - V₊)', 'V = A/(V₊ - V₋)', 'V = A/(V₋ - V₊)'], correctAnswer: 0 },
                    { id: 'q15', question: 'What is the relationship between power and current in a DC circuit?', options: ['P = I²R', 'P = R/I²', 'P = I/R²', 'P = R²/I'], correctAnswer: 0 },
                    { id: 'q16', question: 'What is the relationship between voltage and current in a capacitor?', options: ['V = Q/C', 'V = C/Q', 'V = QC', 'V = Q/C²'], correctAnswer: 0 },
                    { id: 'q17', question: 'What is the relationship between current and voltage in an inductor?', options: ['V = L dI/dt', 'V = I/L', 'V = LI', 'V = L/I'], correctAnswer: 0 },
                    { id: 'q18', question: 'What is the relationship between power and voltage in a DC circuit?', options: ['P = V²/R', 'P = R/V²', 'P = V²R', 'P = V/R²'], correctAnswer: 0 },
                    { id: 'q19', question: 'What is the relationship between current and voltage in a resistor?', options: ['V = IR', 'V = I/R', 'V = R/I', 'V = I + R'], correctAnswer: 0 },
                    { id: 'q20', question: 'What is the relationship between power and current in a DC circuit?', options: ['P = I²R', 'P = R/I²', 'P = I/R²', 'P = R²/I'], correctAnswer: 0 },
                ];
            } else if (isAdvanced) {
                generatedQuestions = [
                    { id: 'q1', question: 'What is the relationship between electric field and magnetic field in Maxwell\'s equations?', options: ['∇ × E = -∂B/∂t', '∇ × B = -∂E/∂t', '∇ × E = ∂B/∂t', '∇ × B = ∂E/∂t'], correctAnswer: 0 },
                    { id: 'q2', question: 'What is the relationship between electric field and magnetic field in electromagnetic waves?', options: ['E = cB', 'B = cE', 'E = B/c', 'B = E/c'], correctAnswer: 0 },
                    { id: 'q3', question: 'What is the relationship between electric field and magnetic field in a plane wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q4', question: 'What is the relationship between electric field and magnetic field in a standing wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q5', question: 'What is the relationship between electric field and magnetic field in a circularly polarized wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q6', question: 'What is the relationship between electric field and magnetic field in a linearly polarized wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q7', question: 'What is the relationship between electric field and magnetic field in a spherical wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q8', question: 'What is the relationship between electric field and magnetic field in a cylindrical wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q9', question: 'What is the relationship between electric field and magnetic field in a plane wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q10', question: 'What is the relationship between electric field and magnetic field in a standing wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q11', question: 'What is the relationship between electric field and magnetic field in a circularly polarized wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q12', question: 'What is the relationship between electric field and magnetic field in a linearly polarized wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q13', question: 'What is the relationship between electric field and magnetic field in a spherical wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q14', question: 'What is the relationship between electric field and magnetic field in a cylindrical wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q15', question: 'What is the relationship between electric field and magnetic field in a plane wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q16', question: 'What is the relationship between electric field and magnetic field in a standing wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q17', question: 'What is the relationship between electric field and magnetic field in a circularly polarized wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q18', question: 'What is the relationship between electric field and magnetic field in a linearly polarized wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q19', question: 'What is the relationship between electric field and magnetic field in a spherical wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                    { id: 'q20', question: 'What is the relationship between electric field and magnetic field in a cylindrical wave?', options: ['E × B = k', 'E · B = 0', 'E = B', 'E = -B'], correctAnswer: 1 },
                ];
            }
        }
    }
    // Set the questions
    setQuizQuestions(generatedQuestions);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return; // Don't allow changes after submission
    
    setQuizQuestions(questions => 
      questions.map(q => 
        q.id === questionId ? { ...q, userAnswer: optionIndex } : q
      )
    );
  };

  const handleQuizSubmit = async () => {
    try {
      // Log all localStorage keys and values for debugging
      console.log("------- QUIZ SUBMISSION - STORAGE DEBUG -------");
      console.log("localStorage keys:", Object.keys(localStorage));
      
      // Log the actual values of key localStorage items
      console.log("studentEmail:", localStorage.getItem('studentEmail'));
      console.log("userEmail:", localStorage.getItem('userEmail'));
      console.log("userName:", localStorage.getItem('userName'));
      console.log("userGrade:", localStorage.getItem('userGrade'));
      console.log("userBoard:", localStorage.getItem('userBoard'));
      
      // Try to parse currentUser if it exists
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          console.log("currentUser parsed:", currentUser);
        } catch (e) {
          console.error("Error parsing currentUser:", e);
        }
      }
      
      // Directly grab email from localStorage - simplest approach
      const studentEmail = localStorage.getItem('studentEmail');
      
      if (!studentEmail) {
        alert("You must be logged in to submit quizzes.");
        return;
      }
      
      // Calculate score
      const quizResult = calculateQuizScore();
      
      // Get subject information from the course
      const subject = course?.subject || '';
      
      console.log("Submitting quiz with email:", studentEmail);
      
      // Directly send to backend using the service with minimal data
      const response = await submitAssessmentScore(
        studentEmail,
        courseId || '',
        currentLecture?.moduleId || '',
        currentLecture?.id || '',
        'quiz', // Changed from (currentLecture?.type as 'quiz' | 'assignment' | 'project') || 'quiz'
        quizResult.score,
        quizResult.total,
        course?.title || '',
        quizResult.percentage,
        subject
      );
      
      console.log("Quiz submitted successfully");
      
      // Show toast/alert
      alert(`Quiz submitted successfully! You scored ${quizResult.score}/${quizResult.total} (${quizResult.percentage}%)`);
      
      setQuizSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz: " + (error.message || "Unknown error"));
    }
  };

  const calculateQuizScore = () => {
    const correctAnswers = quizQuestions.filter(q => 
      q.userAnswer !== undefined && q.userAnswer === q.correctAnswer
    ).length;
    
    return {
      score: correctAnswers,
      total: quizQuestions.length,
      percentage: Math.round((correctAnswers / quizQuestions.length) * 100)
    };
  };

  const getLectureIcon = (type: string) => {
    switch(type) {
      case 'video': return <PlayCircle className="text-navbar" size={18} />;
      case 'reading': return <FileText className="text-green-600" size={18} />;
      case 'quiz': return <BookOpen className="text-purple-600" size={18} />;
      case 'assignment': return <FileText className="text-orange-500" size={18} />;
      default: return <PlayCircle className="text-navbar" size={18} />;
    }
  };

  const handleNotebookClick = () => setActiveTab('notes');

  if (loading) {
    return (
      <div className="flex">
        <StudentSidebar onNotebookClick={handleNotebookClick} />
        <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navbar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex">
        <StudentSidebar onNotebookClick={handleNotebookClick} />
        <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-red-500 text-center">
                <p className="text-xl mb-2">Error loading course</p>
                <p>{error || 'Course not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <StudentSidebar onNotebookClick={handleNotebookClick} />
      <div className="flex-1 pt-24 px-6 bg-background min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          {/* Course Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Link to="/student/Courses" className="text-navbar hover:text-button-secondary flex items-center">
                <ArrowLeft size={20} className="mr-2" />
                Back to My Courses
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold text-text-primary mb-2">{course.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    {course.subject}
                  </span>
                  {/* <span className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {course.studentsEnrolled.toLocaleString()} students
                  </span> */}
                  {/* <span className="flex items-center">
                    <Star size={16} className="mr-1 text-yellow-500 fill-current" />
                    {course.rating.toFixed(1)}
                  </span> */}
                </div>
                {/* <p className="text-gray-700 mb-4">
                  Instructor: <span className="font-medium">{course.instructor}</span>
                </p> */}
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {course.totalHours} hours
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {course.totalModules} modules
                  </div>
                </div>
              </div>

              {/* <div className="md:w-1/3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-text-primary mb-2">Your Progress</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-navbar rounded-full h-4" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{course.progress}% complete</span>
                    <span>{course.completedModules}/{course.totalModules} modules</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Course Content Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'content' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('content')}
              >
                Course Content
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'discussion' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('discussion')}
              >
                Discussion
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'notes' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('notes')}
              >
                My Notes
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <p className="text-sm text-gray-600">{course.totalModules} modules • {course.totalHours} hours</p>
                </div>

                <div className="divide-y">
                  {course.modules.map((module) => (
                    <div key={module.id} className="transition-all duration-300">
                      <div 
                        className={`p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${expandedModules[module.id] ? 'bg-gray-50' : ''}`}
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-text-primary mb-1">{module.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {module.duration}
                            </span>
                            <span className="flex items-center">
                              <PlayCircle size={14} className="mr-1" />
                              {module.lectures.length} lectures
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {module.lectures.every(l => l.completed) && (
                            <span className="text-green-600">
                              <CheckCircle size={18} />
                            </span>
                          )}
                          {expandedModules[module.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>

                      {expandedModules[module.id] && (
                        <div className="bg-gray-50 border-t">
                          <div className="p-4 text-sm text-gray-700 mb-2">
                            {module.description}
                          </div>
                          <ul className="divide-y divide-gray-100">
                            {module.lectures.map((lecture) => (
                              <li 
                                key={lecture.id} 
                                className={`p-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                                  (currentVideo === lecture.url || (currentLecture?.id === lecture.id && showQuiz)) ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => handleLectureClick(lecture, module.id)}
                              >
                                <div className="flex items-center">
                                  {getLectureIcon(lecture.type)}
                                  <span className="ml-3">{lecture.title}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="text-gray-500">{lecture.duration}</span>
                                  {lecture.completed && <CheckCircle size={16} className="text-green-600" />}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Video Player and Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              {activeTab === 'content' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {currentVideo && !showQuiz ? (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe 
                        src={currentVideo} 
                        className="w-full h-full" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : showQuiz ? (
                    <div className="p-6">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">
                          {currentLecture?.type === 'assessment' ? 'Assessment' : 'Assignment'}: {currentLecture?.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Complete {currentLecture?.type === 'assessment' ? 'the assessment' : 'this assignment'} to continue with the course.
                        </p>
                        {!quizSubmitted && <p className="text-sm text-gray-500 mt-1">Duration: {currentLecture?.duration}</p>}
                      </div>

                      {quizSubmitted ? (
                        <div className="mb-8">
                          <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-medium mb-2">Results</h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-bold">{calculateQuizScore().percentage}%</p>
                                <p className="text-sm text-gray-600">
                                  {calculateQuizScore().score} out of {calculateQuizScore().total} correct
                                </p>
                              </div>
                              {calculateQuizScore().percentage >= 70 ? (
                                <div className="flex items-center text-green-600">
                                  <Check size={20} className="mr-2" />
                                  <span className="font-medium">Passed</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-red-500">
                                  <AlertCircle size={20} className="mr-2" />
                                  <span className="font-medium">Not passed</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-4">Review your answers:</h3>
                            {quizQuestions.map((question, index) => (
                              <div key={question.id} className="mb-6">
                                <p className="font-medium mb-2">
                                  {index + 1}. {question.question}
                                </p>
                                <div className="ml-4">
                                  {question.options.map((option, optIndex) => (
                                    <div 
                                      key={optIndex} 
                                      className={`py-2 px-3 rounded-md mb-2 ${
                                        question.correctAnswer === optIndex
                                          ? 'bg-green-100 border border-green-300'
                                          : question.userAnswer === optIndex && question.userAnswer !== question.correctAnswer
                                            ? 'bg-red-100 border border-red-300'
                                            : 'bg-gray-50'
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        {question.correctAnswer === optIndex && (
                                          <Check size={16} className="text-green-600 mr-2" />
                                        )}
                                        <span>{option}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <button 
                            onClick={() => setShowQuiz(false)}
                            className="mt-4 px-6 py-3 bg-navbar text-white rounded-lg hover:bg-opacity-90 transition-colors"
                          >
                            Continue with course
                          </button>
                        </div>
                      ) : (
                        <div>
                          {quizQuestions.map((question, index) => (
                            <div key={question.id} className="mb-8">
                              <p className="font-medium mb-3">
                                Question {index + 1}: {question.question}
                              </p>
                              <div className="ml-4">
                                {question.options.map((option, optIndex) => (
                                  <div 
                                    key={optIndex} 
                                    className={`py-3 px-4 rounded-md mb-2 cursor-pointer ${
                                      question.userAnswer === optIndex 
                                        ? 'bg-blue-100 border border-blue-300' 
                                        : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleAnswerSelect(question.id, optIndex)}
                                  >
                                    <div className="flex items-center">
                                      <div className={`w-5 h-5 rounded-full border ${
                                        question.userAnswer === optIndex 
                                          ? 'border-blue-500 bg-blue-500' 
                                          : 'border-gray-400'
                                      } mr-3 flex items-center justify-center`}>
                                        {question.userAnswer === optIndex && (
                                          <div className="w-2 h-2 rounded-full bg-white"></div>
                                        )}
                                      </div>
                                      <span>{option}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                          <div className="mt-8 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                              Answer all {quizQuestions.length} questions to submit.
                            </p>
                            <button 
                              onClick={handleQuizSubmit}
                              disabled={quizQuestions.some(q => q.userAnswer === undefined)}
                              className={`px-6 py-3 rounded-lg ${
                                quizQuestions.some(q => q.userAnswer === undefined)
                                  ? 'bg-gray-300 cursor-not-allowed'
                                  : 'bg-navbar text-white hover:bg-opacity-90 transition-colors'
                              }`}
                            >
                              Submit {currentLecture?.type === 'assessment' ? 'Assessment' : 'Assignment'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <PlayCircle size={48} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">Select a lecture to start learning</p>
                      </div>
                    </div>
                  )}

                  {/* Content description */}
                  {!showQuiz && currentVideo && (
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4">{currentLecture?.title}</h2>
                      <p className="text-gray-700 mb-4">
                        {course.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'overview' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Course Overview</h2>
                  <p className="text-gray-700 mb-6">
                    {course.description}
                  </p>
                  
                  <h3 className="font-medium text-lg mb-3">What You'll Learn</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <Check size={18} className="text-green-500 mr-2 mt-1" />
                      <span>Master the key concepts and principles in {course.subject}</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-500 mr-2 mt-1" />
                      <span>Apply theoretical knowledge to practical problems and scenarios</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-500 mr-2 mt-1" />
                      <span>Develop critical thinking skills related to the subject matter</span>
                    </li>
                    <li className="flex items-start">
                      <Check size={18} className="text-green-500 mr-2 mt-1" />
                      <span>Gain confidence in your understanding through regular assessments</span>
                    </li>
                  </ul>
                  
                  <h3 className="font-medium text-lg mb-3">Prerequisites</h3>
                  <p className="text-gray-700 mb-6">
                    Basic understanding of the subject fundamentals is recommended, though not required.
                    This course is designed to accommodate learners at various levels.
                  </p>
                  
                  <h3 className="font-medium text-lg mb-3">About the Instructor</h3>
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
                    <div>
                      <h4 className="font-medium">{course.instructor}</h4>
                      <p className="text-gray-600 text-sm mb-2">Professor of {course.subject}</p>
                      <p className="text-gray-700">
                        An expert in the field with over 10 years of teaching experience.
                        Specializes in making complex concepts accessible to students of all levels.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Discussion Forum</h2>
                  <div className="mb-6">
                    <textarea 
                      className="w-full border rounded-lg p-4 min-h-[100px]"
                      placeholder="Ask a question or start a discussion..."
                    ></textarea>
                    <button className="mt-3 bg-navbar text-white px-4 py-2 rounded-lg">
                      Post
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                          <div>
                            <p className="font-medium">John Smith</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                        <button className="text-navbar text-sm">Reply</button>
                      </div>
                      <p className="text-gray-700">
                        Can someone explain the concept from module 2 in more detail? I'm having trouble understanding it.
                      </p>
                      
                      <div className="ml-8 mt-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                            <div>
                              <p className="font-medium">Instructor</p>
                              <p className="text-xs text-gray-500">1 day ago</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Great question! In module 2, we're primarily focusing on... [answer continues]
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <p className="text-xs text-gray-500">1 week ago</p>
                          </div>
                        </div>
                        <button className="text-navbar text-sm">Reply</button>
                      </div>
                      <p className="text-gray-700">
                        I found a great resource related to this topic that might help others: [link]
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">My Notes</h2>
                  <textarea 
                    className="w-full border rounded-lg p-4 min-h-[300px]"
                    placeholder="Write your notes here..."
                  ></textarea>
                  <div className="mt-4 flex justify-between">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                      Clear
                    </button>
                    <button className="bg-navbar text-white px-4 py-2 rounded-lg">
                      Save Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;