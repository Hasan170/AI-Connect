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
    } else if (lecture.type === 'quiz' || lecture.type === 'assignment') {
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

    // Generate questions based on lecture title and type
    const isQuiz = lecture.type === 'quiz';
    const questionsCount = isQuiz ? 5 : 3;
    const subject = course?.subject || '';
    
    let generatedQuestions: QuizQuestion[] = [];
    
    // Generate different questions based on the lecture subject/title
    if (subject.includes('Math') || lecture.title.includes('Calculus')) {
      generatedQuestions = [
        {
          id: 'q1',
          question: 'What is the derivative of x²?',
          options: ['x', '2x', '2x²', 'x²'],
          correctAnswer: 1
        },
        {
          id: 'q2',
          question: 'The integral of cos(x) is:',
          options: ['sin(x) + C', '-sin(x) + C', 'tan(x) + C', 'sec(x) + C'],
          correctAnswer: 0
        },
        {
          id: 'q3',
          question: 'What is the limit of (sin x)/x as x approaches 0?',
          options: ['0', '1', 'infinity', 'undefined'],
          correctAnswer: 1
        },
        {
          id: 'q4',
          question: 'Which of the following functions is not continuous at x = 0?',
          options: ['f(x) = x²', 'f(x) = |x|', 'f(x) = 1/x', 'f(x) = sin(x)'],
          correctAnswer: 2
        },
        {
          id: 'q5',
          question: 'The chain rule is used for:',
          options: ['Addition of functions', 'Multiplication of functions', 'Division of functions', 'Composition of functions'],
          correctAnswer: 3
        }
      ];
    } else if (subject.includes('Physics') || lecture.title.includes('Physics')) {
      generatedQuestions = [
        {
          id: 'q1',
          question: 'What is the SI unit of force?',
          options: ['Watt', 'Joule', 'Newton', 'Pascal'],
          correctAnswer: 2
        },
        {
          id: 'q2',
          question: 'Einstein\'s famous equation E=mc² relates:',
          options: ['Energy and momentum', 'Mass and energy', 'Force and acceleration', 'Velocity and time'],
          correctAnswer: 1
        },
        {
          id: 'q3',
          question: 'Which physical quantity remains conserved in all processes?',
          options: ['Velocity', 'Temperature', 'Energy', 'Electric charge'],
          correctAnswer: 2
        },
        {
          id: 'q4',
          question: 'The second law of thermodynamics concerns:',
          options: ['Conservation of mass', 'Conservation of energy', 'Increase of entropy', 'Conservation of momentum'],
          correctAnswer: 2
        },
        {
          id: 'q5',
          question: 'Which particle is responsible for electromagnetic force?',
          options: ['Neutrino', 'Photon', 'Gluon', 'W boson'],
          correctAnswer: 1
        }
      ];
    } else if (subject.includes('Chemistry') || lecture.title.includes('Chemistry')) {
      generatedQuestions = [
        {
          id: 'q1',
          question: 'What type of hybridization is present in a carbon atom of benzene?',
          options: ['sp', 'sp²', 'sp³', 'sp³d'],
          correctAnswer: 1
        },
        {
          id: 'q2',
          question: 'Which functional group is present in alcohols?',
          options: ['-COOH', '-CHO', '-OH', '-NH₂'],
          correctAnswer: 2
        },
        {
          id: 'q3',
          question: 'The IUPAC name of CH₃-CH₂-CH₂-OH is:',
          options: ['Propanol', '1-Propanol', '3-Propanol', 'Propan-1-ol'],
          correctAnswer: 1
        },
        {
          id: 'q4',
          question: 'Which type of reaction involves the transfer of electrons?',
          options: ['Substitution', 'Elimination', 'Addition', 'Redox'],
          correctAnswer: 3
        },
        {
          id: 'q5',
          question: 'What is the bond angle in a sp³ hybridized carbon?',
          options: ['90°', '109.5°', '120°', '180°'],
          correctAnswer: 1
        }
      ];
    } else if (subject.includes('Literature') || lecture.title.includes('Literature')) {
      generatedQuestions = [
        {
          id: 'q1',
          question: 'Who wrote "Romeo and Juliet"?',
          options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
          correctAnswer: 1
        },
        {
          id: 'q2',
          question: 'A figure of speech where non-human objects are given human qualities is called:',
          options: ['Metaphor', 'Simile', 'Personification', 'Alliteration'],
          correctAnswer: 2
        },
        {
          id: 'q3',
          question: 'Which literary movement emphasized emotion, individualism, and glorification of nature?',
          options: ['Modernism', 'Realism', 'Romanticism', 'Naturalism'],
          correctAnswer: 2
        },
        {
          id: 'q4',
          question: 'What is the main theme of "Paradise Lost" by John Milton?',
          options: ['Love and betrayal', 'Fall of man', 'Class struggle', 'Industrialization'],
          correctAnswer: 1
        },
        {
          id: 'q5',
          question: 'Which literary device involves contradictory terms appearing in conjunction?',
          options: ['Hyperbole', 'Oxymoron', 'Irony', 'Euphemism'],
          correctAnswer: 1
        }
      ];
    } else {
      // Default questions
      generatedQuestions = [
        {
          id: 'q1',
          question: 'Which of these is a best practice in the field?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 2
        },
        {
          id: 'q2',
          question: 'What is the primary concept introduced in this module?',
          options: ['Concept 1', 'Concept 2', 'Concept 3', 'Concept 4'],
          correctAnswer: 1
        },
        {
          id: 'q3',
          question: 'Which statement best describes the main theory discussed?',
          options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'],
          correctAnswer: 0
        },
        {
          id: 'q4',
          question: 'What is the key takeaway from this lecture?',
          options: ['Takeaway 1', 'Takeaway 2', 'Takeaway 3', 'Takeaway 4'],
          correctAnswer: 2
        },
        {
          id: 'q5',
          question: 'Which example best illustrates the concept?',
          options: ['Example A', 'Example B', 'Example C', 'Example D'],
          correctAnswer: 1
        }
      ];
    }
    
    // Limit the number of questions based on quiz/assignment
    setQuizQuestions(generatedQuestions.slice(0, questionsCount));
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
        (currentLecture?.type as 'quiz' | 'assignment' | 'project') || 'quiz',
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
                  <span className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {course.studentsEnrolled.toLocaleString()} students
                  </span>
                  <span className="flex items-center">
                    <Star size={16} className="mr-1 text-yellow-500 fill-current" />
                    {course.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  Instructor: <span className="font-medium">{course.instructor}</span>
                </p>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {course.totalHours} hours
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {course.totalModules} modules
                  </div>
                </div>
              </div>

              <div className="md:w-1/3">
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
              </div>
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
                          {currentLecture?.type === 'quiz' ? 'Quiz' : 'Assignment'}: {currentLecture?.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Complete {currentLecture?.type === 'quiz' ? 'the quiz' : 'this assignment'} to continue with the course.
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
                              Submit {currentLecture?.type === 'quiz' ? 'Quiz' : 'Assignment'}
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