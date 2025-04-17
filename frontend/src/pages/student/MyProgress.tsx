import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  BarChart, 
  CheckCircle, 
  Info, 
  ChevronRight, 
  Brain, 
  Award, 
  Star, 
  Book,
  Video,
  Edit
} from 'lucide-react';
import StudentSidebar from '../../components/StudentSidebar';
import api from '../../api';

interface SkillProgress {
  skill: string;
  level: number;
  nextMilestone: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  milestones: Milestone[];
  currentMilestone: number;
  progress: number;
  recommended: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  resources: {
    type: 'video' | 'article' | 'quiz' | 'exercise';
    title: string;
    url?: string;
  }[];
  completed: boolean;
}

interface RecommendedResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'exercise';
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  url?: string;
}

const MyProgress: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [recommendedResources, setRecommendedResources] = useState<RecommendedResource[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'recommendations'>('overview');
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          // Mock skills data
          setSkills([
            { skill: 'Mathematics', level: 7, nextMilestone: 'Advanced Calculus' },
            { skill: 'Physics', level: 5, nextMilestone: 'Quantum Mechanics' },
            { skill: 'Chemistry', level: 3, nextMilestone: 'Organic Chemistry' },
            { skill: 'Biology', level: 6, nextMilestone: 'Cellular Biology' },
          ]);
          
          // Mock learning paths
          setLearningPaths([
            {
              id: 'path1',
              title: 'Advanced Mathematics Mastery',
              description: 'Master advanced mathematics concepts step by step',
              progress: 65,
              currentMilestone: 2,
              recommended: true,
              milestones: [
                {
                  id: 'm1',
                  title: 'Algebra Foundations',
                  description: 'Master the fundamentals of algebra',
                  completed: true,
                  resources: [
                    { type: 'video', title: 'Algebra Fundamentals' },
                    { type: 'quiz', title: 'Algebra Practice Quiz' }
                  ]
                },
                {
                  id: 'm2',
                  title: 'Calculus Introduction',
                  description: 'Understand the basics of calculus',
                  completed: true,
                  resources: [
                    { type: 'video', title: 'Introduction to Calculus' },
                    { type: 'exercise', title: 'Calculus Exercises' }
                  ]
                },
                {
                  id: 'm3',
                  title: 'Advanced Calculus',
                  description: 'Master differential equations and advanced integration',
                  completed: false,
                  resources: [
                    { type: 'video', title: 'Differential Equations' },
                    { type: 'article', title: 'Integration Techniques' },
                    { type: 'quiz', title: 'Advanced Calculus Quiz' }
                  ]
                }
              ]
            },
            {
              id: 'path2',
              title: 'Physics Fundamentals',
              description: 'Build a strong foundation in physics',
              progress: 40,
              currentMilestone: 1,
              recommended: true,
              milestones: [
                {
                  id: 'm1',
                  title: 'Classical Mechanics',
                  description: 'Understand Newton\'s laws and classical mechanics',
                  completed: true,
                  resources: [
                    { type: 'video', title: 'Newton\'s Laws' },
                    { type: 'quiz', title: 'Classical Mechanics Quiz' }
                  ]
                },
                {
                  id: 'm2',
                  title: 'Thermodynamics',
                  description: 'Learn the laws of thermodynamics',
                  completed: false,
                  resources: [
                    { type: 'video', title: 'Laws of Thermodynamics' },
                    { type: 'exercise', title: 'Thermodynamics Problems' }
                  ]
                }
              ]
            }
          ]);
          
          // Mock recommended resources
          setRecommendedResources([
            {
              id: 'res1',
              title: 'Mastering Algebra: Complete Guide',
              type: 'video',
              subject: 'Mathematics',
              difficulty: 'intermediate',
              description: 'A comprehensive guide to algebra concepts with practice problems'
            },
            {
              id: 'res2',
              title: 'Understanding Quantum Physics',
              type: 'article',
              subject: 'Physics',
              difficulty: 'advanced',
              description: 'An introduction to quantum physics for intermediate students'
            },
            {
              id: 'res3',
              title: 'Chemistry Fundamentals Quiz',
              type: 'quiz',
              subject: 'Chemistry',
              difficulty: 'beginner',
              description: 'Test your understanding of basic chemistry concepts'
            }
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setLoading(false);
      }
    };
    
    fetchProgressData();
  }, []);

  const handlePathClick = (path: LearningPath) => {
    setSelectedPath(path);
  };

  return (
    <div className="pt-24 pl-64 bg-background min-h-screen">
      <StudentSidebar onNotebookClick={() => setIsNotebookOpen(true)} />
      
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">My Learning Progress</h1>
        <p className="text-gray-600 mb-8">
          AI-personalized learning path and progress tracking to help you achieve your goals
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'paths' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('paths')}
              >
                Learning Paths
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'recommendations' ? 'text-navbar border-b-2 border-navbar' : 'text-gray-600 hover:text-navbar'}`}
                onClick={() => setActiveTab('recommendations')}
              >
                AI Recommendations
              </button>
            </div>
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {/* Overall Progress */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                    <LineChart size={20} className="mr-2 text-navbar" />
                    Overall Progress
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-2">Your Subject Skills</h3>
                      
                      {skills.map((skill, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                            <span className="text-sm font-medium text-navbar">Level {skill.level}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-navbar rounded-full h-2.5" 
                              style={{ width: `${(skill.level/10) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Next milestone: {skill.nextMilestone}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-2">Weekly Study Activity</h3>
                      <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
                        <p className="text-gray-500">Interactive chart will appear here</p>
                        {/* In a real app, you would integrate a chart library like Chart.js or Recharts */}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Insights */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                    <Brain size={20} className="mr-2 text-navbar" />
                    AI Insights & Recommendations
                  </h2>
                  
                  <div className="bg-blue-50 border-l-4 border-navbar p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Based on your recent performance:</span> You've made excellent progress in Algebra, but your understanding of Trigonometry could use some reinforcement.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-text-primary mb-2 flex items-center">
                        <Award size={16} className="mr-2 text-navbar" />
                        Strengths
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li className="flex items-start">
                          <CheckCircle size={16} className="mr-2 text-green-500 mt-0.5" />
                          Strong understanding of algebraic equations
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="mr-2 text-green-500 mt-0.5" />
                          Excellent at solving word problems
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={16} className="mr-2 text-green-500 mt-0.5" />
                          Good grasp of basic calculus concepts
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-text-primary mb-2 flex items-center">
                        <Info size={16} className="mr-2 text-amber-500" />
                        Areas for Improvement
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li className="flex items-start">
                          <ChevronRight size={16} className="mr-2 text-amber-500 mt-0.5" />
                          Trigonometric identities and applications
                        </li>
                        <li className="flex items-start">
                          <ChevronRight size={16} className="mr-2 text-amber-500 mt-0.5" />
                          Complex number operations
                        </li>
                        <li className="flex items-start">
                          <ChevronRight size={16} className="mr-2 text-amber-500 mt-0.5" />
                          Statistical analysis methods
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Achievement Badges */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                    <Star size={20} className="mr-2 text-navbar" />
                    Your Achievements
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {title: 'Math Master', description: 'Completed 10 math assignments', icon: '🧮', unlocked: true},
                      {title: 'Science Explorer', description: 'Completed 5 science modules', icon: '🔬', unlocked: true},
                      {title: 'Consistent Learner', description: 'Studied for 7 days in a row', icon: '📚', unlocked: true},
                      {title: 'Quantum Thinker', description: 'Mastered quantum physics', icon: '⚛️', unlocked: false},
                    ].map((badge, index) => (
                      <div key={index} className={`p-4 rounded-lg text-center ${badge.unlocked ? 'bg-gray-50' : 'bg-gray-100 opacity-60'}`}>
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h3 className="font-medium text-text-primary">{badge.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                        {!badge.unlocked && <span className="text-xs text-gray-400 block mt-2">Locked</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Learning Paths Tab */}
            {activeTab === 'paths' && (
              <div>
                {selectedPath ? (
                  <div>
                    <button 
                      onClick={() => setSelectedPath(null)}
                      className="mb-4 flex items-center text-navbar hover:underline"
                    >
                      <ChevronRight className="rotate-180 mr-1" size={16} />
                      Back to All Paths
                    </button>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                      <h2 className="text-xl font-semibold text-text-primary mb-1">{selectedPath.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedPath.description}</p>
                      
                      <div className="mb-6">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                          <span className="text-sm font-medium text-navbar">{selectedPath.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-navbar rounded-full h-2.5" 
                            style={{ width: `${selectedPath.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium text-text-primary mb-3">Milestones</h3>
                      <div className="space-y-4">
                        {selectedPath.milestones.map((milestone, index) => (
                          <div 
                            key={milestone.id} 
                            className={`border rounded-lg p-4 ${milestone.completed ? 'border-green-200 bg-green-50' : index === selectedPath.currentMilestone ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                          >
                            <div className="flex items-start">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${milestone.completed ? 'bg-green-500 text-white' : index === selectedPath.currentMilestone ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                                {milestone.completed ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  <span className="text-xs">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-text-primary">{milestone.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                                
                                {index === selectedPath.currentMilestone && !milestone.completed && (
                                  <div className="mt-3">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">Learning Resources:</h5>
                                    <ul className="space-y-2">
                                      {milestone.resources.map((resource, i) => (
                                        <li key={i} className="flex items-center">
                                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                            {resource.type === 'video' && <Video size={16} className="text-red-500" />}
                                            {resource.type === 'article' && <Book size={16} className="text-blue-500" />}
                                            {resource.type === 'quiz' && <BarChart size={16} className="text-green-500" />}
                                            {resource.type === 'exercise' && <Edit size={16} className="text-purple-500" />}
                                          </div>
                                          <div>
                                            <span className="text-sm font-medium">{resource.title}</span>
                                            <span className="text-xs text-gray-500 ml-2 capitalize">{resource.type}</span>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                    <button className="mt-4 bg-navbar text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                                      Start Learning
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {learningPaths.map(path => (
                      <div 
                        key={path.id} 
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handlePathClick(path)}
                      >
                        {path.recommended && (
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">
                            AI Recommended
                          </div>
                        )}
                        <h3 className="text-lg font-medium text-text-primary mb-2">{path.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{path.description}</p>
                        
                        <div className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">Progress</span>
                            <span className="text-xs font-medium text-navbar">{path.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-navbar rounded-full h-2" 
                              style={{ width: `${path.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Current milestone: {path.currentMilestone + 1}/{path.milestones.length}
                          </span>
                          <ChevronRight size={16} className="text-navbar" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* AI Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                    <Brain size={20} className="mr-2 text-navbar" />
                    AI-Personalized Recommendations
                  </h2>
                  
                  <div className="bg-blue-50 border-l-4 border-navbar p-4 rounded-md mb-6">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Learning Intelligence:</span> Based on your learning patterns and assessment results, our AI has recommended the following resources to help you improve.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {recommendedResources.map(resource => (
                      <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:border-navbar transition-colors">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                            {resource.type === 'video' && <Video size={20} className="text-red-500" />}
                            {resource.type === 'article' && <Book size={20} className="text-blue-500" />}
                            {resource.type === 'quiz' && <BarChart size={20} className="text-green-500" />}
                            {resource.type === 'exercise' && <Edit size={20} className="text-purple-500" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-text-primary">{resource.title}</h3>
                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                              <span>{resource.subject}</span>
                              <span>•</span>
                              <span className="capitalize">{resource.difficulty}</span>
                              <span>•</span>
                              <span className="capitalize">{resource.type}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{resource.description}</p>
                            <button className="mt-3 text-sm text-navbar hover:underline">
                              Open Resource
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Learning Style Analysis</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-3">Your Learning Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Visual Learning</span>
                            <span className="text-sm font-medium text-navbar">75%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-navbar rounded-full h-2.5" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Auditory Learning</span>
                            <span className="text-sm font-medium text-navbar">45%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-navbar rounded-full h-2.5" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Kinesthetic Learning</span>
                            <span className="text-sm font-medium text-navbar">60%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-navbar rounded-full h-2.5" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-3">AI Insights</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          You learn best through visual aids and hands-on activities. Consider:
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-sm text-gray-700 space-y-1">
                          <li>Using diagrams and charts to visualize complex concepts</li>
                          <li>Watching video tutorials with practical examples</li>
                          <li>Taking notes with color-coding and visual organization</li>
                          <li>Engaging in interactive practice exercises</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyProgress;