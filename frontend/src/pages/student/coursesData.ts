export interface Lecture {
  id: string;
  title: string;
  type: 'video' | 'reading' |'assessment';
  duration: string;
  completed: boolean;
  url?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  lectures: Lecture[];
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  studentsEnrolled: number;
  duration: string;
  progress?: number;
  totalModules: number;
  completedModules?: number;
  totalHours: number;
  description: string;
  modules: Module[];
}

export const coursesData: Record<string, Course> = {
  //9 courses for mathemathics
  //3 beginer, 3 intermediate, 3 advanced
  //below three are beginer

// topic 1: Fundamentals of Arithmetic - Beginer
// topic 2: Introduction to Algebra - Beginer
// topic 3: Geometry Basics - Beginer

  '1': {
    id: '1',
    title: 'Fundamentals of Arithmetic - Beginer',
    subject: 'Mathematics',
    instructor: 'Dr. Emily Peterson',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    rating: 4.8,
    studentsEnrolled: 2150,
    duration: '15 hours',
    progress: 35,
    totalModules: 3,
    completedModules: 1,
    totalHours: 15,
    description: 'Master the essential arithmetic operations and build a solid mathematical foundation. This course covers numbers, operations, fractions, decimals, and percentages with practical applications.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Number Systems and Operations',
        description: 'Understanding number systems and basic operations with integers.',
        duration: '5h',
        completed: true,
        lectures: [
          {
            id: 'l1',
            title: 'Introduction to Number Systems',
            type: 'video',
            duration: '30m',
            completed: true,
            url: 'https://www.youtube.com/embed/QJ0dGJMSMvE'
          },
          {
            id: 'l2',
            title: 'Addition and Subtraction Techniques',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/rqmBNIwlIrA'
          },
          {
            id: 'l3',
            title: 'Multiplication Methods',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/0NA2lc4QdIE'
          },
          {
            id: 'l4',
            title: 'Division Strategies',
            type: 'reading',
            duration: '35m',
            completed: true
          },
          {
            id: 'l5',
            title: 'Order of Operations (PEMDAS)',
            type: 'video',
            duration: '30m',
            completed: true,
            url: 'https://www.youtube.com/embed/dAgfnK528RA'
          }
          // {
          //   id: 'l6',
          //   title: 'Module 1 Assessment',
          //   type: 'quiz',
          //   duration: '40m',
          //   completed: true
          // }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Fractions and Decimals',
        description: 'Working with fractions, decimals, and their operations.',
        duration: '5h 30m',
        completed: false,
        lectures: [
          {
            id: 'l7',
            title: 'Understanding Fractions',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/kDzB9eHbqls'
          },
          {
            id: 'l8',
            title: 'Adding and Subtracting Fractions',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/qmfXyR7Z6Lk'
          },
          {
            id: 'l9',
            title: 'Multiplying and Dividing Fractions',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/4lkq3DgvmJo'
          },
          {
            id: 'l10',
            title: 'Converting Between Fractions and Decimals',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l11',
            title: 'Decimal Operations',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/kwh4SD1ToFc'
          }
          // {
          //   id: 'l12',
          //   title: 'Practice with Fractions and Decimals',
          //   type: 'assignment',
          //   duration: '50m',
          //   completed: false
          // }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Percentages and Applications',
        description: 'Understanding percentages and their real-world applications.',
        duration: '4h 30m',
        completed: false,
        lectures: [
          {
            id: 'l13',
            title: 'Introduction to Percentages',
            type: 'video',
            duration: '30m',
            completed: false,
            url: 'https://www.youtube.com/embed/Iz9825HRurw'
          },
          {
            id: 'l14',
            title: 'Converting Between Percentages, Decimals, and Fractions',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/kr43f5ERYxg'
          },
          {
            id: 'l15',
            title: 'Finding Percentages of Numbers',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l16',
            title: 'Percentage Increase and Decrease',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/THPJ7CtUK8M'
          },
          {
            id: 'l17',
            title: 'Real-world Applications: Discounts and Interest',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/9VlqB5iWWa4'
          },
          {
            id: 'l18',
            title: 'Final Course Assessment',
            type: 'assessment',
            duration: '45m',
            completed: false
          }
        ]
      }
    ]
  },

  '2': {
    id: '2',
    title: 'Introduction to Algebra - Beginer',
    subject: 'Mathematics',
    instructor: 'Prof. David Wilson',
    thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
    rating: 4.7,
    studentsEnrolled: 1820,
    duration: '16 hours',
    progress: 50,
    totalModules: 3,
    completedModules: 1,
    totalHours: 16,
    description: 'Begin your journey into algebra with this comprehensive introduction. Learn about variables, expressions, equations, and functions, and how to use algebraic thinking to solve real-world problems.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Algebraic Expressions',
        description: 'Understanding variables, expressions, and basic algebraic concepts.',
        duration: '5h 30m',
        completed: true,
        lectures: [
          {
            id: 'l1',
            title: 'Introduction to Algebraic Thinking',
            type: 'video',
            duration: '30m',
            completed: true,
            url: 'https://www.youtube.com/embed/NybHckSEQBI'
          },
          {
            id: 'l2',
            title: 'Variables and Constants',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/i6sbjtJjJ-A'
          },
          {
            id: 'l3',
            title: 'Evaluating Expressions',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/SKDlT221Ui8'
          },
          {
            id: 'l4',
            title: 'Simplifying Expressions',
            type: 'reading',
            duration: '45m',
            completed: true
          },
          {
            id: 'l5',
            title: 'Combining Like Terms',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/NLX_1mz1gLY'
          }
          // {
          //   id: 'l6',
          //   title: 'Expressions Practice Assignment',
          //   type: 'assignment',
          //   duration: '50m',
          //   completed: true
          // }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Solving Equations',
        description: 'Learning to solve various types of algebraic equations.',
        duration: '5h 30m',
        completed: false,
        lectures: [
          {
            id: 'l7',
            title: 'Introduction to Equations',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/l3XzepN03KQ'
          },
          {
            id: 'l8',
            title: 'One-step Equations',
            type: 'video',
            duration: '30m',
            completed: true,
            url: 'https://www.youtube.com/embed/Qyd_v3DGzTM'
          },
          {
            id: 'l9',
            title: 'Two-step Equations',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/LDIiYKYvvdA'
          },
          {
            id: 'l10',
            title: 'Multi-step Equations',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l11',
            title: 'Equations with Variables on Both Sides',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/7Jspa2IuEXs'
          }
          // {
          //   id: 'l12',
          //   title: 'Module 2 Assessment',
          //   type: 'quiz',
          //   duration: '45m',
          //   completed: false
          // }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Introduction to Functions',
        description: 'Understanding the concept of functions and their representations.',
        duration: '5h',
        completed: false,
        lectures: [
          {
            id: 'l13',
            title: 'What is a Function?',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/52tpYl2tTqk'
          },
          {
            id: 'l14',
            title: 'Function Notation',
            type: 'video',
            duration: '30m',
            completed: false,
            url: 'https://www.youtube.com/embed/rovLsYmv45A'
          },
          {
            id: 'l15',
            title: 'Graphing Simple Functions',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/tSL3Y8H1lFQ'
          },
          {
            id: 'l16',
            title: 'Linear Functions',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l17',
            title: 'Function Applications',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/qf6kFLAGnOk'
          },
          {
            id: 'l18',
            title: 'Final Course Assessment',
            type: 'assessment',
            duration: '45m',
            completed: false
          }
        ]
      }
    ]
  },

  '3': {
    id: '3',
    title: 'Geometry Basics - Beginer',
    subject: 'Mathematics',
    instructor: 'Dr. Michael Lee',
    thumbnail: 'https://images.unsplash.com/photo-1645680827507-9f392edae51c',
    rating: 4.6,
    studentsEnrolled: 1560,
    duration: '14 hours',
    totalModules: 3,
    totalHours: 14,
    description: 'Explore the fundamental concepts of geometry, including shapes, angles, and spatial relationships. This course provides a comprehensive introduction to geometric principles with practical applications.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Points, Lines, and Angles',
        description: 'Understanding the basic building blocks of geometry.',
        duration: '4h 30m',
        completed: false,
        lectures: [
          {
            id: 'l1',
            title: 'Introduction to Geometry',
            type: 'video',
            duration: '30m',
            completed: false,
            url: 'https://www.youtube.com/embed/JEKmF7RfgSU'
          },
          {
            id: 'l2',
            title: 'Points and Lines',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/4SXx_Szhd4c'
          },
          {
            id: 'l3',
            title: 'Types of Angles',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/DGKwdHMiqCg'
          },
          {
            id: 'l4',
            title: 'Measuring Angles',
            type: 'reading',
            duration: '35m',
            completed: false
          },
          {
            id: 'l5',
            title: 'Angle Relationships',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/xMgpCeHHN2E'
          }
          // {
          //   id: 'l6',
          //   title: 'Module 1 Quiz',
          //   type: 'quiz',
          //   duration: '35m',
          //   completed: false
          // }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Polygons and Triangles',
        description: 'Exploring different types of polygons with a focus on triangles.',
        duration: '5h',
        completed: false,
        lectures: [
          {
            id: 'l7',
            title: 'Introduction to Polygons',
            type: 'video',
            duration: '30m',
            completed: false,
            url: 'https://www.youtube.com/embed/IaoZhhx_I9s'
          },
          {
            id: 'l8',
            title: 'Properties of Triangles',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/UjAKRXAiHZI'
          },
          {
            id: 'l9',
            title: 'Triangle Classification',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/SHQJeH1XmEQ'
          },
          {
            id: 'l10',
            title: 'Triangle Congruence',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l11',
            title: 'Quadrilaterals and Their Properties',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/_KF42dLgKmo'
          }
          // {
          //   id: 'l12',
          //   title: 'Polygon Practice',
          //   type: 'assignment',
          //   duration: '50m',
          //   completed: false
          // }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Area, Perimeter, and Volume',
        description: 'Calculating measurements for 2D and 3D shapes.',
        duration: '4h 30m',
        completed: false,
        lectures: [
          {
            id: 'l13',
            title: 'Perimeter of 2D Shapes',
            type: 'video',
            duration: '30m',
            completed: false,
            url: 'https://www.youtube.com/embed/AAY1bsazcgM'
          },
          {
            id: 'l14',
            title: 'Area of Triangles and Quadrilaterals',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/xCdxURXMdFY'
          },
          {
            id: 'l15',
            title: 'Area of Circles',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/YokKp3pwVFc'
          },
          {
            id: 'l16',
            title: 'Introduction to 3D Shapes',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l17',
            title: 'Volume of Common Solids',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/qJwecTgce6c'
          },
          {
            id: 'l18',
            title: 'Final Course Assessment',
            type: 'assessment',
            duration: '45m',
            completed: false
          }
        ]
      }
    ]
  },

  //below three are intermediate
// topic 4: Fundamentals of Arithmetic - Intermediate
// topic 5: Introduction to Algebra - Intermediate
// topic 6: Geometry Basics - Intermediate

'4': {
  id: '4',
  title: 'Introduction to Algebra - Intermediate',
  subject: 'Mathematics',
  instructor: 'Dr. Robert Chen',
  thumbnail: 'https://images.unsplash.com/photo-1580894908361-967195033215',
  rating: 4.7,
  studentsEnrolled: 1680,
  duration: '18 hours',
  progress: 25,
  totalModules: 3,
  completedModules: 1,
  totalHours: 18,
  description: 'Build on your algebraic foundations with intermediate concepts including quadratic equations, systems of equations, inequalities, and polynomial functions to solve more complex problems.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Quadratic Equations',
      description: 'Understanding and solving quadratic equations using various methods.',
      duration: '6h',
      completed: true,
      lectures: [
        {
          id: 'l1',
          title: 'Introduction to Quadratic Equations',
          type: 'video',
          duration: '35m',
          completed: true,
          url: 'https://www.youtube.com/embed/ZBalWWHYFQc'
        },
        {
          id: 'l2',
          title: 'Solving by Factoring',
          type: 'video',
          duration: '40m',
          completed: true,
          url: 'https://www.youtube.com/embed/ZVkMkiJ3ySY'
        },
        {
          id: 'l3',
          title: 'Completing the Square',
          type: 'video',
          duration: '45m',
          completed: true,
          url: 'https://www.youtube.com/embed/2ZzuZvz33X0'
        },
        {
          id: 'l4',
          title: 'The Quadratic Formula',
          type: 'video',
          duration: '40m',
          completed: true,
          url: 'https://www.youtube.com/embed/i7idZfS8t8w'
        },
        {
          id: 'l5',
          title: 'Applications of Quadratic Equations',
          type: 'reading',
          duration: '50m',
          completed: true
        }
        // {
        //   id: 'l6',
        //   title: 'Quadratic Equations Practice',
        //   type: 'assignment',
        //   duration: '1h',
        //   completed: true
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Systems of Equations',
      description: 'Solving problems involving multiple equations and variables.',
      duration: '6h 30m',
      completed: false,
      lectures: [
        {
          id: 'l7',
          title: 'Introduction to Systems of Equations',
          type: 'video',
          duration: '35m',
          completed: true,
          url: 'https://www.youtube.com/embed/nok99JOhcjo'
        },
        {
          id: 'l8',
          title: 'Solving by Substitution',
          type: 'video',
          duration: '40m',
          completed: true,
          url: 'https://www.youtube.com/embed/QYJNxS5BHlo'
        },
        {
          id: 'l9',
          title: 'Solving by Elimination',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/XOIrKnK_mukk'
        },
        {
          id: 'l10',
          title: 'Systems with Three Variables',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/HYWeEx21R7k'
        },
        {
          id: 'l11',
          title: 'Matrix Methods',
          type: 'reading',
          duration: '55m',
          completed: false
        },
        {
          id: 'l12',
          title: 'Applications of Systems',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/2JbqzjOzWQQ'
        }
        // {
        //   id: 'l13',
        //   title: 'Systems of Equations Quiz',
        //   type: 'quiz',
        //   duration: '45m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Polynomials and Rational Functions',
      description: 'Advanced polynomial concepts and rational function operations.',
      duration: '5h 30m',
      completed: false,
      lectures: [
        {
          id: 'l14',
          title: 'Polynomial Functions',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/cRHtA1qFJPM'
        },
        {
          id: 'l15',
          title: 'Operations with Polynomials',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/PtsrAw1LR3E'
        },
        {
          id: 'l16',
          title: 'Dividing Polynomials',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/PkdYZeDCFHY'
        },
        {
          id: 'l17',
          title: 'Rational Functions',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l18',
          title: 'Asymptotes and Graphing',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/NzoWQpnmGaQ'
        },
        {
          id: 'l19',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'5': {
  id: '5',
  title: 'Fundamentals of Arithmetic - Intermediate',
  subject: 'Mathematics',
  instructor: 'Prof. Jessica Martinez',
  thumbnail: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896',
  rating: 4.8,
  studentsEnrolled: 1870,
  duration: '17 hours',
  progress: 45,
  totalModules: 3,
  completedModules: 1,
  totalHours: 17,
  description: 'Deepen your arithmetic skills with complex problem-solving strategies, number theory concepts, and practical applications to prepare for more advanced mathematical studies.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Number Theory Foundations',
      description: 'Exploring properties and relationships among integers and number systems.',
      duration: '5h 30m',
      completed: true,
      lectures: [
        {
          id: 'l1',
          title: 'Divisibility Rules and Prime Numbers',
          type: 'video',
          duration: '40m',
          completed: true,
          url: 'https://www.youtube.com/embed/5D1xiv3ELn0'
        },
        {
          id: 'l2',
          title: 'Greatest Common Divisor and Least Common Multiple',
          type: 'video',
          duration: '45m',
          completed: true,
          url: 'https://www.youtube.com/embed/11X7JGdgbAg'
        },
        {
          id: 'l3',
          title: 'Modular Arithmetic',
          type: 'video',
          duration: '40m',
          completed: true,
          url: 'https://www.youtube.com/embed/KvtLWgCTwn4'
        },
        {
          id: 'l4',
          title: 'Introduction to Diophantine Equations',
          type: 'reading',
          duration: '50m',
          completed: true
        },
        {
          id: 'l5',
          title: 'Number Sequences and Patterns',
          type: 'video',
          duration: '35m',
          completed: true,
          url: 'https://www.youtube.com/embed/nUFWA_XRFqg'
        }
        // {
        //   id: 'l6',
        //   title: 'Number Theory Practice Problems',
        //   type: 'assignment',
        //   duration: '1h',
        //   completed: true
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Advanced Fractions and Ratios',
      description: 'Complex operations and applications with fractions, ratios, and proportions.',
      duration: '6h',
      completed: false,
      lectures: [
        {
          id: 'l7',
          title: 'Complex Fraction Operations',
          type: 'video',
          duration: '40m',
          completed: true,
          url: 'https://www.youtube.com/embed/npD3QvyCn0o'
        },
        {
          id: 'l8',
          title: 'Ratio and Proportion Applications',
          type: 'video',
          duration: '45m',
          completed: true,
          url: 'https://www.youtube.com/embed/RQ6gRF1y3LI'
        },
        {
          id: 'l9',
          title: 'Direct and Inverse Proportion',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/gaBk-WT4qpA'
        },
        {
          id: 'l10',
          title: 'Working with Mixed Units',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        {
          id: 'l11',
          title: 'Fraction Problem Solving Strategies',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/8TS9xRh0V-Y'
        }
        // {
        //   id: 'l12',
        //   title: 'Ratio and Proportion Quiz',
        //   type: 'quiz',
        //   duration: '45m',
        //   completed: false
        // },
        // {
        //   id: 'l13',
        //   title: 'Applied Proportion Problems',
        //   type: 'assignment',
        //   duration: '55m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Advanced Applications',
      description: 'Real-world mathematical modeling and problem-solving using arithmetic concepts.',
      duration: '5h 30m',
      completed: false,
      lectures: [
        {
          id: 'l14',
          title: 'Mathematical Modeling with Arithmetic',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/eJ2V9-vGKC0'
        },
        {
          id: 'l15',
          title: 'Business Mathematics Applications',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/WA5oUUr0YLg'
        },
        {
          id: 'l16',
          title: 'Compound Interest and Financial Calculations',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/YmEKjpJiBYE'
        },
        {
          id: 'l17',
          title: 'Statistical Measures and Data Analysis',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l18',
          title: 'Problem-Solving with Multiple Operations',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/2NhfRGx3GUA'
        },
        {
          id: 'l19',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'6': {
  id: '6',
  title: 'Geometry Basics - Intermediate',
  subject: 'Mathematics',
  instructor: 'Dr. Thomas Wright',
  thumbnail: 'https://images.unsplash.com/photo-1573551089778-46a7abc39d9f',
  rating: 4.7,
  studentsEnrolled: 1530,
  duration: '18 hours',
  progress: 30,
  totalModules: 3,
  completedModules: 1,
  totalHours: 18,
  description: 'Advance your understanding of geometric principles with in-depth study of coordinate geometry, transformations, and geometric proofs, bridging basic concepts to more complex spatial reasoning.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Coordinate Geometry',
      description: 'Working with the coordinate plane and analytical geometry concepts.',
      duration: '6h',
      completed: true,
      lectures: [
        {
          id: 'l1',
          title: 'The Coordinate Plane System',
          type: 'video',
          duration: '35m',
          completed: true,
          url: 'https://www.youtube.com/embed/8gB5bhNzU4U'
        },
        {
          id: 'l2',
          title: 'Distance and Midpoint Formulas',
          type: 'video',
          duration: '40m',
          completed: true,
          url: 'https://www.youtube.com/embed/szBhvOszbeY'
        },
        {
          id: 'l3',
          title: 'Equations of Lines',
          type: 'video',
          duration: '45m',
          completed: true,
          url: 'https://www.youtube.com/embed/E7Voso411Vs'
        },
        {
          id: 'l4',
          title: 'Parallel and Perpendicular Lines',
          type: 'reading',
          duration: '40m',
          completed: true
        },
        {
          id: 'l5',
          title: 'Working with Circles in the Coordinate Plane',
          type: 'video',
          duration: '45m',
          completed: true,
          url: 'https://www.youtube.com/embed/Qrm6x1Ko8JQ'
        }
        // {
        //   id: 'l6',
        //   title: 'Coordinate Geometry Quiz',
        //   type: 'quiz',
        //   duration: '40m',
        //   completed: true
        // },
        // {
        //   id: 'l7',
        //   title: 'Analytical Geometry Problems',
        //   type: 'assignment',
        //   duration: '55m',
        //   completed: true
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Transformations and Congruence',
      description: 'Understanding geometric transformations and their properties.',
      duration: '6h 30m',
      completed: false,
      lectures: [
        {
          id: 'l8',
          title: 'Introduction to Transformations',
          type: 'video',
          duration: '35m',
          completed: true,
          url: 'https://www.youtube.com/embed/J6ESboM0Lfs'
        },
        {
          id: 'l9',
          title: 'Translations, Rotations and Reflections',
          type: 'video',
          duration: '50m',
          completed: true,
          url: 'https://www.youtube.com/embed/-qAtO0Qe8rY'
        },
        {
          id: 'l10',
          title: 'Dilations and Similarity',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/o0lbIRxs24o'
        },
        {
          id: 'l11',
          title: 'Congruence and Triangles',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l12',
          title: 'Proving Congruence with Transformations',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/U-9jn_SC9XI'
        }
        // {
        //   id: 'l13',
        //   title: 'Transformation Applications',
        //   type: 'assignment',
        //   duration: '1h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Geometric Proofs',
      description: 'Developing skills in formal geometric reasoning and proof structures.',
      duration: '5h 30m',
      completed: false,
      lectures: [
        {
          id: 'l14',
          title: 'Introduction to Geometric Proofs',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/3_F2YV3ZMbA'
        },
        {
          id: 'l15',
          title: 'Logic and Proof Structures',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/02wxlSXu6CY'
        },
        {
          id: 'l16',
          title: 'Triangle Proofs',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/7rA3zWZUHqY'
        },
        {
          id: 'l17',
          title: 'Quadrilateral and Circle Proofs',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        {
          id: 'l18',
          title: 'Advanced Geometric Theorems',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/1geCUh3TQhA'
        },
        {
          id: 'l19',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

// topic 7: Fundamentals of Arithmetic - Advanced
// topic 8: Introduction to Algebra - Advanced
// topic 9: Geometry Basics - Advanced

'7': {
  id: '7',
  title: 'Fundamentals of Arithmetic - Advanced',
  subject: 'Mathematics',
  instructor: 'Dr. Alexander Patel',
  thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
  rating: 4.9,
  studentsEnrolled: 1240,
  duration: '22 hours',
  progress: 10,
  totalModules: 3,
  completedModules: 0,
  totalHours: 22,
  description: 'Delve into sophisticated arithmetic concepts and number theory. This advanced course explores complex number systems, cryptographic applications, and advanced problem-solving techniques used in modern mathematics.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Advanced Number Theory',
      description: 'Exploring advanced concepts in number theory and their applications.',
      duration: '8h',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Congruence Relations and Modular Arithmetic',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/EEmavJcTPHE'
        },
        {
          id: 'l2',
          title: 'Fermat\'s Little Theorem and Applications',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/NMxM4pMsjYc'
        },
        {
          id: 'l3',
          title: 'Euler\'s Theorem and Function',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/qq5b-uL2Bwk'
        },
        {
          id: 'l4',
          title: 'Primitive Roots and Indices',
          type: 'reading',
          duration: '1h',
          completed: false
        },
        {
          id: 'l5',
          title: 'Quadratic Residues and Reciprocity',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/01c15pNHLSg'
        },
        {
          id: 'l6',
          title: 'Number-Theoretic Algorithms',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/tTV2vDGjlfQ'
        }
        // {
        //   id: 'l7',
        //   title: 'Module 1 Assessment',
        //   type: 'quiz',
        //   duration: '45m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Cryptographic Applications',
      description: 'Number theory applications in modern cryptography and security.',
      duration: '7h',
      completed: false,
      lectures: [
        {
          id: 'l8',
          title: 'Introduction to Cryptography',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/jhXCTbFnK8o'
        },
        {
          id: 'l9',
          title: 'Prime Numbers and Factorization',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/AaiqJHbCT0A'
        },
        {
          id: 'l10',
          title: 'RSA Encryption Algorithm',
          type: 'video',
          duration: '1h',
          completed: false,
          url: 'https://www.youtube.com/embed/4zahvcJ9glg'
        },
        {
          id: 'l11',
          title: 'Elliptic Curve Cryptography',
          type: 'reading',
          duration: '1h 10m',
          completed: false
        },
        {
          id: 'l12',
          title: 'Cryptographic Hash Functions',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/DMtFhACPnTY'
        }
        // {
        //   id: 'l13',
        //   title: 'Cryptography Implementation Project',
        //   type: 'assignment',
        //   duration: '1h 30m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Advanced Problem Solving',
      description: 'Sophisticated arithmetic techniques for solving complex mathematical problems.',
      duration: '7h',
      completed: false,
      lectures: [
        {
          id: 'l14',
          title: 'Diophantine Equations',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/HeBpIiOKcRs'
        },
        {
          id: 'l15',
          title: 'Advanced Number Sequences',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/NAzLY-2RGZE'
        },
        {
          id: 'l16',
          title: 'Analytic Number Theory Introduction',
          type: 'reading',
          duration: '1h',
          completed: false
        },
        {
          id: 'l17',
          title: 'The Prime Number Theorem',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/l8ezziaEeNE'
        },
        {
          id: 'l18',
          title: 'Additive Number Theory',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/QH1WfCwdLQU'
        },
        // {
        //   id: 'l19',
        //   title: 'Number Theory Research Project',
        //   type: 'assignment',
        //   duration: '2h',
        //   completed: false
        // },
        {
          id: 'l20',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'8': {
  id: '8',
  title: 'Introduction to Algebra - Advanced',
  subject: 'Mathematics',
  instructor: 'Prof. Eleanor Lewis',
  thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
  rating: 4.8,
  studentsEnrolled: 980,
  duration: '24 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 24,
  description: 'Master advanced algebraic structures and their properties. This rigorous course covers groups, rings, fields, Galois theory, and their applications in modern mathematics and computer science.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Group Theory',
      description: 'In-depth study of groups, subgroups, and related structures.',
      duration: '8h',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Introduction to Abstract Algebra',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/IP7nW_hKB7I'
        },
        {
          id: 'l2',
          title: 'Groups and Subgroups',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/KufsL2VgELo'
        },
        {
          id: 'l3',
          title: 'Cyclic Groups and Group Homomorphisms',
          type: 'video',
          duration: '1h',
          completed: false,
          url: 'https://www.youtube.com/embed/mH0oCDa74tE'
        },
        {
          id: 'l4',
          title: 'Cosets and Lagrange\'s Theorem',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Normal Subgroups and Quotient Groups',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/QG4QEJ0CgS8'
        },
        {
          id: 'l6',
          title: 'Group Actions and the Class Equation',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/ERASYhGcnHE'
        },
        {
          id: 'l7',
          title: 'Sylow Theorems',
          type: 'reading',
          duration: '1h',
          completed: false
        }
        // {
        //   id: 'l8',
        //   title: 'Group Theory Assessment',
        //   type: 'quiz',
        //   duration: '45m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Ring Theory',
      description: 'Advanced concepts in rings, ideals, and polynomial rings.',
      duration: '8h',
      completed: false,
      lectures: [
        {
          id: 'l9',
          title: 'Rings and Subrings',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/SC_RtLr_Otc'
        },
        {
          id: 'l10',
          title: 'Integral Domains and Fields',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/dlRplxSBG2c'
        },
        {
          id: 'l11',
          title: 'Ideals and Quotient Rings',
          type: 'video',
          duration: '1h',
          completed: false,
          url: 'https://www.youtube.com/embed/5EkPXQ2lXjo'
        },
        {
          id: 'l12',
          title: 'Ring Homomorphisms',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        {
          id: 'l13',
          title: 'Polynomial Rings',
          type: 'video',
          duration: '1h',
          completed: false,
          url: 'https://www.youtube.com/embed/tW-QCnLcpU0'
        },
        {
          id: 'l14',
          title: 'Factorization Theory in Integral Domains',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/D_89mIoWKnk'
        }
        // {
        //   id: 'l15',
        //   title: 'Ring Theory Problems',
        //   type: 'assignment',
        //   duration: '1h 30m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Field Theory and Applications',
      description: 'Advanced field extensions, Galois theory, and modern applications.',
      duration: '8h',
      completed: false,
      lectures: [
        {
          id: 'l16',
          title: 'Field Extensions',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/vW5CWuzSdCE'
        },
        {
          id: 'l17',
          title: 'Algebraic Extensions',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/VdwX2_Ri4B8'
        },
        {
          id: 'l18',
          title: 'Introduction to Galois Theory',
          type: 'reading',
          duration: '1h',
          completed: false
        },
        {
          id: 'l19',
          title: 'The Fundamental Theorem of Galois Theory',
          type: 'video',
          duration: '1h 10m',
          completed: false,
          url: 'https://www.youtube.com/embed/C80vLfIRNqE'
        },
        {
          id: 'l20',
          title: 'Solvability by Radicals',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/Ct2fyigNgPE'
        },
        {
          id: 'l21',
          title: 'Applications in Coding Theory',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/v6W_gIc01ME'
        },
        {
          id: 'l22',
          title: 'Abstract Algebra in Cryptography',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        // {
        //   id: 'l23',
        //   title: 'Final Research Project',
        //   type: 'assignment',
        //   duration: '2h',
        //   completed: false
        // },
        {
          id: 'l24',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'9': {
  id: '9',
  title: 'Geometry Basics - Advanced',
  subject: 'Mathematics',
  instructor: 'Dr. Victoria Chang',
  thumbnail: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a',
  rating: 4.9,
  studentsEnrolled: 850,
  duration: '20 hours',
  progress: 5,
  totalModules: 3,
  completedModules: 0,
  totalHours: 20,
  description: 'Explore advanced geometric concepts and their applications in modern mathematics. This rigorous course covers differential geometry, non-Euclidean geometries, topology, and geometric measure theory.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Differential Geometry',
      description: 'Study of curves, surfaces, and manifolds using calculus techniques.',
      duration: '7h',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Introduction to Differential Geometry',
          type: 'video',
          duration: '45m',
          completed: true,
          url: 'https://www.youtube.com/embed/tVCuvMUBTl4'
        },
        {
          id: 'l2',
          title: 'Curves in Space',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/JX3VmDgiFnY'
        },
        {
          id: 'l3',
          title: 'Curvature and Torsion',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/1lfZ5A0XI_s'
        },
        {
          id: 'l4',
          title: 'Theory of Surfaces',
          type: 'reading',
          duration: '1h',
          completed: false
        },
        {
          id: 'l5',
          title: 'First and Second Fundamental Forms',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/CdoLhJBqEEg'
        },
        {
          id: 'l6',
          title: 'Gaussian and Mean Curvature',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/TwA1EgEXn0U'
        }
        // {
        //   id: 'l7',
        //   title: 'Differential Geometry Problems',
        //   type: 'assignment',
        //   duration: '1h 15m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Non-Euclidean Geometries',
      description: 'Exploring geometries beyond the Euclidean framework.',
      duration: '6h 30m',
      completed: false,
      lectures: [
        {
          id: 'l8',
          title: 'Historical Development of Non-Euclidean Geometry',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/zQo_S3yNa2w'
        },
        {
          id: 'l9',
          title: 'Hyperbolic Geometry',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/jFEBdpGManc'
        },
        {
          id: 'l10',
          title: 'Models of Hyperbolic Geometry',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/i0i19sq5exs'
        },
        {
          id: 'l11',
          title: 'Elliptic and Spherical Geometry',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        {
          id: 'l12',
          title: 'Riemannian Geometry Introduction',
          type: 'video',
          duration: '1h',
          completed: false,
          url: 'https://www.youtube.com/embed/m-G9eG9Yn9w'
        },
        {
          id: 'l13',
          title: 'Connections and Geodesics',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/_10KuMU_ouo'
        }
        // {
        //   id: 'l14',
        //   title: 'Non-Euclidean Geometry Assessment',
        //   type: 'quiz',
        //   duration: '45m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Topology and Geometric Measure Theory',
      description: 'Advanced concepts connecting geometry, analysis, and topology.',
      duration: '6h 30m',
      completed: false,
      lectures: [
        {
          id: 'l15',
          title: 'Introduction to Topology',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/dEKDq3H9BMo'
        },
        {
          id: 'l16',
          title: 'Topological Invariants',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/AmgkSdhK4K8'
        },
        {
          id: 'l17',
          title: 'Differential Forms and Integration',
          type: 'reading',
          duration: '55m',
          completed: false
        },
        {
          id: 'l18',
          title: 'Introduction to Geometric Measure Theory',
          type: 'video',
          duration: '1h',
          completed: false,
          url: 'https://www.youtube.com/embed/iyg0z1HFNc8'
        },
        {
          id: 'l19',
          title: 'Hausdorff Measure and Dimension',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/7LdYMkEsIzk'
        },
        {
          id: 'l20',
          title: 'Applications in Mathematical Physics',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/1UMwJjVZiHM'
        },
        // {
        //   id: 'l21',
        //   title: 'Final Geometric Analysis Project',
        //   type: 'assignment',
        //   duration: '1h 30m',
        //   completed: false
        // },
        {
          id: 'l22',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

//PHYSICS

//topic10: Classical Mechanics - Beginner
//topic11: Electricity and Magnetism - Beginner
//topic12: Thermodynamics - Beginner

'10': {
  id: '10',
  title: 'Classical Mechanics - Beginner',
  subject: 'Physics',
  instructor: 'Dr. Sarah Johnson',
  thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa',
  rating: 4.7,
  studentsEnrolled: 1680,
  duration: '16 hours',
  progress: 15,
  totalModules: 3,
  completedModules: 0,
  totalHours: 16,
  description: 'Understand the fundamental principles of classical mechanics, including motion, forces, energy, and momentum. This course provides a solid foundation in Newtonian physics with practical applications.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Kinematics and Motion',
      description: 'Understanding displacement, velocity, acceleration and motion in one and two dimensions.',
      duration: '5h 30m',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Introduction to Physics and Measurement',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/ZM8ECpBuQYE'
        },
        {
          id: 'l2',
          title: 'Motion in One Dimension',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/bKEaK7WNLzM'
        },
        {
          id: 'l3',
          title: 'Vectors and Coordinate Systems',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/0ujKgsrUKyE'
        },
        {
          id: 'l4',
          title: 'Motion in Two Dimensions',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Projectile Motion',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/bB7Nyfe2XnA'
        }
        // {
        //   id: 'l6',
        //   title: 'Kinematics Practice Problems',
        //   type: 'assignment',
        //   duration: '1h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Newton\'s Laws and Forces',
      description: 'Exploring Newton\'s laws of motion and their applications to physical systems.',
      duration: '5h 30m',
      completed: false,
      lectures: [
        {
          id: 'l7',
          title: 'Newton\'s First Law and Inertia',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/CQYELiTtUs8'
        },
        {
          id: 'l8',
          title: 'Newton\'s Second Law and Force',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/kKKM8Y-u7ds'
        },
        {
          id: 'l9',
          title: 'Newton\'s Third Law and Interactions',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/By-ggTfeuJU'
        },
        {
          id: 'l10',
          title: 'Weight and Normal Force',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        {
          id: 'l11',
          title: 'Friction and Drag Forces',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/fo_pmp5rtzo'
        }
        // {
        //   id: 'l12',
        //   title: 'Newton\'s Laws Assessment',
        //   type: 'quiz',
        //   duration: '45m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Energy and Momentum',
      description: 'Fundamental concepts of work, energy, and momentum conservation.',
      duration: '5h',
      completed: false,
      lectures: [
        {
          id: 'l13',
          title: 'Work and Energy',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/w4QFJb9a8vo'
        },
        {
          id: 'l14',
          title: 'Kinetic Energy and Potential Energy',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/BSBoLeyRXDY'
        },
        {
          id: 'l15',
          title: 'Conservation of Energy',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/H4DufDTxLDM'
        },
        {
          id: 'l16',
          title: 'Momentum and Impulse',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l17',
          title: 'Conservation of Momentum',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/2Xt04JSYx0E'
        },
        {
          id: 'l18',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'11': {
  id: '11',
  title: 'Electricity and Magnetism - Beginner',
  subject: 'Physics',
  instructor: 'Prof. Robert Maxwell',
  thumbnail: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad',
  rating: 4.6,
  studentsEnrolled: 1450,
  duration: '15 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 15,
  description: 'Discover the fascinating world of electricity and magnetism. Learn about electric charges, fields, circuits, and magnetic phenomena that power our modern technological world.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Electrostatics',
      description: 'Understanding electric charges, forces, and fields.',
      duration: '5h',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Introduction to Electricity',
          type: 'video',
          duration: '30m',
          completed: false,
          url: 'https://www.youtube.com/embed/8bHFMaoUfZw'
        },
        {
          id: 'l2',
          title: 'Electric Charge and Coulomb\'s Law',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/mdulzEfQXDE'
        },
        {
          id: 'l3',
          title: 'Electric Fields',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/q3ZcX3Rjh-w'
        },
        {
          id: 'l4',
          title: 'Electric Potential',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Conductors and Insulators',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/JyX9_LQvPjw'
        }
        // {
        //   id: 'l6',
        //   title: 'Electrostatics Problems',
        //   type: 'assignment',
        //   duration: '45m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Electric Circuits',
      description: 'Basic circuit elements, analysis and applications.',
      duration: '5h',
      completed: false,
      lectures: [
        {
          id: 'l7',
          title: 'Current and Resistance',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/w4CrCwUO4-k'
        },
        {
          id: 'l8',
          title: 'Ohm\'s Law',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/bzwjkcXBw-A'
        },
        {
          id: 'l9',
          title: 'Series and Parallel Circuits',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/XmLg9z9ZP4g'
        },
        {
          id: 'l10',
          title: 'Kirchhoff\'s Rules',
          type: 'reading',
          duration: '40m',
          completed: false
        },
        {
          id: 'l11',
          title: 'Capacitors and RC Circuits',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/RGvvbzPJB5k'
        }
        // {
        //   id: 'l12',
        //   title: 'Circuit Analysis Quiz',
        //   type: 'quiz',
        //   duration: '40m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Magnetism and Electromagnetism',
      description: 'Introduction to magnetic fields and electromagnetic phenomena.',
      duration: '5h',
      completed: false,
      lectures: [
        {
          id: 'l13',
          title: 'Introduction to Magnetism',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/s94suB5uLWw'
        },
        {
          id: 'l14',
          title: 'Magnetic Fields and Forces',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/MMpdHNPGrEA'
        },
        {
          id: 'l15',
          title: 'Sources of Magnetic Fields',
          type: 'reading',
          duration: '40m',
          completed: false
        },
        {
          id: 'l16',
          title: 'Faraday\'s Law and Electromagnetic Induction',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/tC6E9J925pY'
        },
        {
          id: 'l17',
          title: 'Electromagnetic Devices',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/70kL_zz1oJQ'
        },
        {
          id: 'l18',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'12': {
  id: '12',
  title: 'Thermodynamics - Beginner',
  subject: 'Physics',
  instructor: 'Dr. Amanda Thermal',
  thumbnail: 'https://images.unsplash.com/photo-1599509636821-de7359a382d5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  rating: 4.8,
  studentsEnrolled: 1350,
  duration: '14 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 14,
  description: 'Explore the principles of heat, energy transfer, and thermodynamic systems. Learn how temperature and heat flow affect matter and energy conversions that power our world.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Temperature and Heat',
      description: 'Understanding thermal energy, temperature scales, and heat transfer.',
      duration: '4h 30m',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Introduction to Thermodynamics',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/Xb05CaG7TsQ'
        },
        {
          id: 'l2',
          title: 'Temperature and Thermal Equilibrium',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/DlBgM0GKVxU'
        },
        {
          id: 'l3',
          title: 'Heat and Internal Energy',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/-QDr9UgfwJU'
        },
        {
          id: 'l4',
          title: 'Heat Capacity and Specific Heat',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Heat Transfer Methods',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/7Y4YvGtTy-Y'
        }
        // {
        //   id: 'l6',
        //   title: 'Temperature and Heat Quiz',
        //   type: 'quiz',
        //   duration: '30m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Laws of Thermodynamics',
      description: 'The fundamental principles governing energy and heat transfer.',
      duration: '5h',
      completed: false,
      lectures: [
        {
          id: 'l7',
          title: 'The Zeroth Law of Thermodynamics',
          type: 'video',
          duration: '30m',
          completed: false,
          url: 'https://www.youtube.com/embed/OWgVjXqJPFM'
        },
        {
          id: 'l8',
          title: 'The First Law of Thermodynamics',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/VHSy5QTMQsI'
        },
        {
          id: 'l9',
          title: 'Work, Heat, and Internal Energy',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/S3QlPw1tFJo'
        },
        {
          id: 'l10',
          title: 'The Second Law of Thermodynamics',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l11',
          title: 'Entropy and Disorder',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/QkRT8m42qcg'
        }
        // {
        //   id: 'l12',
        //   title: 'Laws of Thermodynamics Assignment',
        //   type: 'assignment',
        //   duration: '1h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Thermodynamic Processes and Applications',
      description: 'Applications of thermodynamics in real-world systems.',
      duration: '4h 30m',
      completed: false,
      lectures: [
        {
          id: 'l13',
          title: 'Ideal Gas Law',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/E13_H7kRhZg'
        },
        {
          id: 'l14',
          title: 'Isothermal, Adiabatic, and Isobaric Processes',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/Oxi1LgSB4U8'
        },
        {
          id: 'l15',
          title: 'Heat Engines and Thermal Efficiency',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/kLqduWF6GXE'
        },
        {
          id: 'l16',
          title: 'Refrigerators and Heat Pumps',
          type: 'reading',
          duration: '40m',
          completed: false
        },
        {
          id: 'l17',
          title: 'Everyday Applications of Thermodynamics',
          type: 'video',
          duration: '35m',
          completed: false,
          url: 'https://www.youtube.com/embed/YX7ftQxXxTI'
        },
        {
          id: 'l18',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

//topic13: Classical Mechanics - Intermediate
//topic14: Electricity and Magnetism - Intermediate
//topic15: Thermodynamics - Intermediate

'13': {
  id: '13',
  title: 'Classical Mechanics - Intermediate',
  subject: 'Physics',
  instructor: 'Prof. Richard Feynman',
  thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d',
  rating: 4.8,
  studentsEnrolled: 1240,
  duration: '20 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 20,
  description: 'Build on fundamental mechanics concepts with more advanced topics including rotational dynamics, oscillations, and Lagrangian mechanics. This course bridges Newtonian concepts to more sophisticated analytical methods.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Rotational Dynamics',
      description: 'Understanding the mechanics of rotating objects and angular motion.',
      duration: '7h',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Angular Kinematics and Variables',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/wylz2GRwJKM'
        },
        {
          id: 'l2',
          title: 'Moment of Inertia',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/FLPTgpY5jd0'
        },
        {
          id: 'l3',
          title: 'Torque and Angular Acceleration',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/3jLXBGM-Hxk'
        },
        {
          id: 'l4',
          title: 'Rotational Kinetic Energy',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Angular Momentum and Conservation',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/u3GVfg6eGM8'
        },
        {
          id: 'l6',
          title: 'Gyroscopic Motion and Precession',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/gaBKm8orrlE'
        }
        // {
        //   id: 'l7',
        //   title: 'Rotational Dynamics Problem Set',
        //   type: 'assignment',
        //   duration: '1h 15m',
        //   completed: false
        // },
        // {
        //   id: 'l8',
        //   title: 'Module Assessment: Rotational Dynamics',
        //   type: 'quiz',
        //   duration: '45m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Oscillations and Waves',
      description: 'Analyzing periodic motion, simple harmonic motion, and wave mechanics.',
      duration: '6h 30m',
      completed: false,
      lectures: [
        {
          id: 'l9',
          title: 'Simple Harmonic Motion',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/VX-0Laeczgk'
        },
        {
          id: 'l10',
          title: 'Energy in Simple Harmonic Motion',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/JJT64r3gKgE'
        },
        {
          id: 'l11',
          title: 'Pendulums and Physical Oscillators',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/Lg2dPv-S9ZE'
        },
        {
          id: 'l12',
          title: 'Damped and Forced Oscillations',
          type: 'reading',
          duration: '55m',
          completed: false
        },
        {
          id: 'l13',
          title: 'Resonance Phenomena',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/mM5ItxIM4h4'
        },
        {
          id: 'l14',
          title: 'Wave Motion and Properties',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/gA_H8dGO5v0'
        }
        // {
        //   id: 'l15',
        //   title: 'Oscillations Laboratory Analysis',
        //   type: 'assignment',
        //   duration: '1h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Analytical Mechanics',
      description: 'Introduction to Lagrangian mechanics and variational principles.',
      duration: '6h 30m',
      completed: false,
      lectures: [
        {
          id: 'l16',
          title: 'Constraints and Degrees of Freedom',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/zhk9xLjrRSE'
        },
        {
          id: 'l17',
          title: 'Generalized Coordinates',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/6ftDUBx2gOI'
        },
        {
          id: 'l18',
          title: 'Virtual Work and D\'Alembert\'s Principle',
          type: 'reading',
          duration: '55m',
          completed: false
        },
        {
          id: 'l19',
          title: 'Lagrangian Formulation',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/QVVTsGI55HM'
        },
        {
          id: 'l20',
          title: 'Euler-Lagrange Equations',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/NHt_BQR1RBs'
        },
        {
          id: 'l21',
          title: 'Conservation Laws in Lagrangian Mechanics',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/UtQXMYPIDgk'
        },
        // {
        //   id: 'l22',
        //   title: 'Final Analytical Mechanics Project',
        //   type: 'assignment',
        //   duration: '1h 30m',
        //   completed: false
        // },
        {
          id: 'l23',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'14': {
  id: '14',
  title: 'Electricity and Magnetism - Intermediate',
  subject: 'Physics',
  instructor: 'Dr. Maria Curie',
  thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557',
  rating: 4.7,
  studentsEnrolled: 1180,
  duration: '19 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 19,
  description: 'Deepen your understanding of electromagnetic phenomena with more advanced concepts including Maxwell\'s equations, electromagnetic waves, AC circuits, and practical applications in modern technology.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Advanced Electrostatics and Magnetostatics',
      description: 'In-depth analysis of electric and magnetic fields in various configurations.',
      duration: '6h 30m',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Electric Fields in Matter',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/1G_Q7eSLj1o'
        },
        {
          id: 'l2',
          title: 'Dielectrics and Polarization',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/acx2LrAdZ3Y'
        },
        {
          id: 'l3',
          title: 'Multipole Expansion',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/JP30gQlmQKc'
        },
        {
          id: 'l4',
          title: 'Laplace\'s and Poisson\'s Equations',
          type: 'reading',
          duration: '55m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Magnetic Fields in Matter',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/3oXzIw4H9oU'
        },
        {
          id: 'l6',
          title: 'Magnetic Materials and Hysteresis',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/1C3UR5Bz8A8'
        }
        // {
        //   id: 'l7',
        //   title: 'Boundary Value Problems',
        //   type: 'assignment',
        //   duration: '1h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Maxwell\'s Equations and Electromagnetic Waves',
      description: 'Understanding the unified theory of electromagnetism and wave propagation.',
      duration: '7h',
      completed: false,
      lectures: [
        {
          id: 'l8',
          title: 'Electromotive Force and Induction',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/qmgbFLJoJZU'
        },
        {
          id: 'l9',
          title: 'Maxwell\'s Equations in Integral Form',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/_r_3O0bJLtM'
        },
        {
          id: 'l10',
          title: 'Maxwell\'s Equations in Differential Form',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/NdbxKE7i3qo'
        },
        {
          id: 'l11',
          title: 'Electromagnetic Wave Equation',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l12',
          title: 'Wave Propagation in Various Media',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/xYGoKDHh4UM'
        },
        {
          id: 'l13',
          title: 'Energy and Momentum in Electromagnetic Waves',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/jP2OWK3AlCQ'
        },
        {
          id: 'l14',
          title: 'Polarization of Electromagnetic Waves',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/FuK52Ti4wM8'
        }
        // {
        //   id: 'l15',
        //   title: 'Maxwell\'s Equations Problem Set',
        //   type: 'assignment',
        //   duration: '1h 15m',
        //   completed: false
        // },
        // {
        //   id: 'l16',
        //   title: 'Electromagnetic Waves Quiz',
        //   type: 'quiz',
        //   duration: '40m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: AC Circuits and Applications',
      description: 'Analysis of alternating current circuits and practical electromagnetic applications.',
      duration: '5h 30m',
      completed: false,
      lectures: [
        {
          id: 'l17',
          title: 'AC Circuit Fundamentals',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/RFbBdXdg2w4'
        },
        {
          id: 'l18',
          title: 'Phasors and Complex Impedance',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/QsJlcKULRiA'
        },
        {
          id: 'l19',
          title: 'RLC Circuits and Resonance',
          type: 'reading',
          duration: '45m',
          completed: false
        },
        {
          id: 'l20',
          title: 'Power in AC Circuits',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/iyG9_UFJVoI'
        },
        {
          id: 'l21',
          title: 'Transformers and Inductance',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/vh_ZvNZNHqw'
        },
        {
          id: 'l22',
          title: 'Electromagnetic Applications in Technology',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/cHm8o6ZwvUk'
        },
        // {
        //   id: 'l23',
        //   title: 'AC Circuit Design Project',
        //   type: 'assignment',
        //   duration: '1h 15m',
        //   completed: false
        // },
        {
          id: 'l24',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'15': {
  id: '15',
  title: 'Thermodynamics - Intermediate',
  subject: 'Physics',
  instructor: 'Prof. Stephen Hawking',
  thumbnail: 'https://images.unsplash.com/photo-1599509636821-de7359a382d5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  rating: 4.9,
  studentsEnrolled: 1060,
  duration: '18 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 18,
  description: 'Expand your thermodynamics knowledge with more rigorous treatments of entropy, free energy, phase transitions, and statistical mechanics foundations. Apply these concepts to real engineering and scientific problems.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Advanced Thermodynamic Potentials',
      description: 'Exploring fundamental thermodynamic functions and their applications.',
      duration: '6h',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Internal Energy and Enthalpy Revisited',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/7Y5u3f0Keq4'
        },
        {
          id: 'l2',
          title: 'Entropy and the Second Law - Advanced Perspective',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/x5ypZelfI_o'
        },
        {
          id: 'l3',
          title: 'Helmholtz and Gibbs Free Energy',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/bdJTK5AOxvs'
        },
        {
          id: 'l4',
          title: 'Maxwell Relations',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Thermodynamic Stability',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/OPN6Z0Y0cEg'
        },
        {
          id: 'l6',
          title: 'The Third Law of Thermodynamics',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/5L10vLOre_Y'
        }
        // {
        //   id: 'l7',
        //   title: 'Thermodynamic Potentials Problem Set',
        //   type: 'assignment',
        //   duration: '1h 15m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Phase Equilibria and Transitions',
      description: 'Understanding states of matter and transitions between phases.',
      duration: '6h 30m',
      completed: false,
      lectures: [
        {
          id: 'l8',
          title: 'Pure Substance Phase Diagrams',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/38I7N68jNoE'
        },
        {
          id: 'l9',
          title: 'Chemical Potential and Phase Equilibrium',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/r9Y3Dg9hEE8'
        },
        {
          id: 'l10',
          title: 'Clausius-Clapeyron Equation',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/HkJUgqlOqgI'
        },
        {
          id: 'l11',
          title: 'Critical Phenomena',
          type: 'reading',
          duration: '55m',
          completed: false
        },
        {
          id: 'l12',
          title: 'Binary and Multicomponent Phase Diagrams',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/rnykjR4F0ys'
        },
        {
          id: 'l13',
          title: 'Phase Transitions and Order Parameters',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/A03b0yw7qvA'
        }
        // {
        //   id: 'l14',
        //   title: 'Phase Equilibria Analysis',
        //   type: 'assignment',
        //   duration: '1h',
        //   completed: false
        // },
        // {
        //   id: 'l15',
        //   title: 'Module Assessment: Phase Transitions',
        //   type: 'quiz',
        //   duration: '35m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Introduction to Statistical Mechanics',
      description: 'Connecting microscopic properties to macroscopic thermodynamics.',
      duration: '5h 30m',
      completed: false,
      lectures: [
        {
          id: 'l16',
          title: 'Statistical Mechanics Foundations',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/4i1MUWJoI0U'
        },
        {
          id: 'l17',
          title: 'Microstates and Macrostates',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/8woIHzXMUxo'
        },
        {
          id: 'l18',
          title: 'Boltzmann Distribution',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l19',
          title: 'Partition Functions',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/Vy93nQ0jE8s'
        },
        {
          id: 'l20',
          title: 'Quantum Statistics Overview',
          type: 'video',
          duration: '45m',
          completed: false,
          url: 'https://www.youtube.com/embed/5hVmeOCJjOU'
        },
        {
          id: 'l21',
          title: 'Connecting Statistical Mechanics to Thermodynamics',
          type: 'video',
          duration: '40m',
          completed: false,
          url: 'https://www.youtube.com/embed/6gXCBnQaUlw'
        },
        // {
        //   id: 'l22',
        //   title: 'Final Statistical Mechanics Project',
        //   type: 'assignment',
        //   duration: '1h 15m',
        //   completed: false
        // },
        {
          id: 'l23',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

// topic16: Classical Mechanics - advanced
// topic17: Electricity and Magnetism - advanced
// topic18: Thermodynamics - advanced

'16': {
  id: '16',
  title: 'Classical Mechanics - Advanced',
  subject: 'Physics',
  instructor: 'Dr. Leonard Susskind',
  thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa',
  rating: 4.9,
  studentsEnrolled: 780,
  duration: '26 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 26,
  description: 'Master advanced classical mechanics concepts including Hamiltonian mechanics, canonical transformations, chaos theory, and relativistic mechanics. This rigorous course connects classical principles to modern theoretical physics.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Hamiltonian Mechanics',
      description: 'Advanced formulation of mechanics using Hamilton\'s principle and canonical variables.',
      duration: '9h',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Hamilton\'s Principle and Variational Methods',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/ApVB5TYeBJI'
        },
        {
          id: 'l2',
          title: 'Legendre Transformations',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/AqVT2yo1UM0'
        },
        {
          id: 'l3',
          title: 'Hamilton\'s Equations of Motion',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/Xo1XojKkX-E'
        },
        {
          id: 'l4',
          title: 'Canonical Transformations',
          type: 'reading',
          duration: '60m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Generating Functions and Types of Transformations',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/tamHs1CqjsQ'
        },
        {
          id: 'l6',
          title: 'Poisson Brackets',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/v0yvRlUAVdw'
        },
        {
          id: 'l7',
          title: 'Hamilton-Jacobi Theory',
          type: 'video',
          duration: '65m',
          completed: false,
          url: 'https://www.youtube.com/embed/NV-oyTYFD0E'
        },
        {
          id: 'l8',
          title: 'Action-Angle Variables',
          type: 'reading',
          duration: '55m',
          completed: false
        }
        // {
        //   id: 'l9',
        //   title: 'Hamiltonian Mechanics Problem Set',
        //   type: 'assignment',
        //   duration: '2h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Nonlinear Dynamics and Chaos',
      description: 'Study of complex systems, nonlinear phenomena, and chaotic behavior in classical dynamics.',
      duration: '8h 30m',
      completed: false,
      lectures: [
        {
          id: 'l10',
          title: 'Introduction to Dynamical Systems',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/ovJcsL7vyrk'
        },
        {
          id: 'l11',
          title: 'Fixed Points and Stability Analysis',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/c_hZV0eqsj0'
        },
        {
          id: 'l12',
          title: 'Bifurcations and Catastrophes',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/4HbQYgmwxOw'
        },
        {
          id: 'l13',
          title: 'Poincaré Maps and Strange Attractors',
          type: 'reading',
          duration: '65m',
          completed: false
        },
        {
          id: 'l14',
          title: 'Lyapunov Exponents',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/5qXKeP7HJks'
        },
        {
          id: 'l15',
          title: 'KAM Theory and Integrability',
          type: 'video',
          duration: '65m',
          completed: false,
          url: 'https://www.youtube.com/embed/oFzTQlsdEvA'
        },
        {
          id: 'l16',
          title: 'Nonlinear Dynamics in Physical Systems',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/ycJEoqmQvwg'
        }
        // {
        //   id: 'l17',
        //   title: 'Chaos Theory Analysis Project',
        //   type: 'assignment',
        //   duration: '2h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Special Relativity and Relativistic Mechanics',
      description: 'Advanced treatment of mechanics in relativistic regimes and spacetime framework.',
      duration: '8h 30m',
      completed: false,
      lectures: [
        {
          id: 'l18',
          title: 'Lorentz Transformations and Spacetime',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/JRZgW1YjCKk'
        },
        {
          id: 'l19',
          title: 'Four-Vectors and Tensor Formalism',
          type: 'video',
          duration: '65m',
          completed: false,
          url: 'https://www.youtube.com/embed/FyBYJJDqoHM'
        },
        {
          id: 'l20',
          title: 'Relativistic Kinematics and Dynamics',
          type: 'reading',
          duration: '60m',
          completed: false
        },
        {
          id: 'l21',
          title: 'Lagrangian and Hamiltonian Formulations in Relativity',
          type: 'video',
          duration: '70m',
          completed: false,
          url: 'https://www.youtube.com/embed/YNEBhwimJWs'
        },
        {
          id: 'l22',
          title: 'Relativistic Central-Force Problems',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/FiMPF6OADDQ'
        },
        {
          id: 'l23',
          title: 'Connections to Electrodynamics and Field Theory',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/URG5qpCAYnk'
        },
        // {
        //   id: 'l24',
        //   title: 'Final Comprehensive Research Project',
        //   type: 'assignment',
        //   duration: '2h 30m',
        //   completed: false
        // },
        {
          id: 'l25',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'17': {
  id: '17',
  title: 'Electricity and Magnetism - Advanced',
  subject: 'Physics',
  instructor: 'Prof. Edward Purcell',
  thumbnail: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad',
  rating: 4.8,
  studentsEnrolled: 680,
  duration: '25 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 25,
  description: 'Delve into sophisticated electromagnetic theory including radiation, relativistic electrodynamics, and quantum aspects of electromagnetic interactions. This course bridges classical electromagnetism with modern quantum field theory.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Advanced Electromagnetic Field Theory',
      description: 'Sophisticated mathematical treatment of electromagnetic fields in various media.',
      duration: '8h 30m',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Tensor Formulation of Maxwell\'s Equations',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/ugbV9NkI9S8'
        },
        {
          id: 'l2',
          title: 'Advanced Boundary Value Problems',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/y7sd4Xavxjs'
        },
        {
          id: 'l3',
          title: 'Green\'s Functions in Electromagnetism',
          type: 'video',
          duration: '65m',
          completed: false,
          url: 'https://www.youtube.com/embed/jLQbFG5Fxjc'
        },
        {
          id: 'l4',
          title: 'Multipole Expansions and Applications',
          type: 'reading',
          duration: '60m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Electromagnetic Fields in Dispersive Media',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/WqRgwDTu1j4'
        },
        {
          id: 'l6',
          title: 'Magnetohydrodynamics',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/1tB7Dtlazrs'
        },
        {
          id: 'l7',
          title: 'Nonlinear Electromagnetic Phenomena',
          type: 'reading',
          duration: '55m',
          completed: false
        }
        // {
        //   id: 'l8',
        //   title: 'Advanced Field Theory Problem Set',
        //   type: 'assignment',
        //   duration: '2h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Electromagnetic Radiation and Wave Dynamics',
      description: 'Advanced concepts in radiation, waveguides, and scattering theory.',
      duration: '8h',
      completed: false,
      lectures: [
        {
          id: 'l9',
          title: 'Advanced Radiation Theory',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/-3CYP9Iilh0'
        },
        {
          id: 'l10',
          title: 'Radiation from Accelerated Charges',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/i8BV2Ui62OY'
        },
        {
          id: 'l11',
          title: 'Synchrotron and Cherenkov Radiation',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/I9hCvnFPl5s'
        },
        {
          id: 'l12',
          title: 'Advanced Waveguide Theory',
          type: 'reading',
          duration: '65m',
          completed: false
        },
        {
          id: 'l13',
          title: 'Surface Waves and Plasmonics',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/z-n5ULbFJNQ'
        },
        {
          id: 'l14',
          title: 'Electromagnetic Scattering Theory',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/hBkEygXhxGE'
        },
        {
          id: 'l15',
          title: 'Electromagnetic Metamaterials',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/PQqqg3S_DBo'
        }
        // {
        //   id: 'l16',
        //   title: 'Advanced Wave Dynamics Project',
        //   type: 'assignment',
        //   duration: '1h 30m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Relativistic Electrodynamics and Quantum Electromagnetism',
      description: 'Connections between electromagnetism, relativity, and quantum theory.',
      duration: '8h 30m',
      completed: false,
      lectures: [
        {
          id: 'l17',
          title: 'Covariant Formulation of Electrodynamics',
          type: 'video',
          duration: '65m',
          completed: false,
          url: 'https://www.youtube.com/embed/MO_Q_f1WgQI'
        },
        {
          id: 'l18',
          title: 'Relativistic Charged Particle Dynamics',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/uSt6qcGX0qU'
        },
        {
          id: 'l19',
          title: 'Liénard-Wiechert Potentials and Retarded Fields',
          type: 'reading',
          duration: '55m',
          completed: false
        },
        {
          id: 'l20',
          title: 'Introduction to Quantum Electrodynamics',
          type: 'video',
          duration: '70m',
          completed: false,
          url: 'https://www.youtube.com/embed/2DBfB4dwbP0'
        },
        {
          id: 'l21',
          title: 'Photons and Gauge Invariance',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/jsvtHrm39cQ'
        },
        {
          id: 'l22',
          title: 'Vacuum Polarization and the Casimir Effect',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/IRcmqZkGOK4'
        },
        {
          id: 'l23',
          title: 'Advanced Computational Electrodynamics',
          type: 'reading',
          duration: '60m',
          completed: false
        },
        // {
        //   id: 'l24',
        //   title: 'Final Theoretical Research Project',
        //   type: 'assignment',
        //   duration: '2h',
        //   completed: false
        // },
        {
          id: 'l25',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
},

'18': {
  id: '18',
  title: 'Thermodynamics - Advanced',
  subject: 'Physics',
  instructor: 'Prof. Ilya Prigogine',
  thumbnail: 'https://images.unsplash.com/photo-1599509636821-de7359a382d5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  rating: 4.9,
  studentsEnrolled: 620,
  duration: '24 hours',
  progress: 0,
  totalModules: 3,
  completedModules: 0,
  totalHours: 24,
  description: 'Explore cutting-edge thermodynamic theory including non-equilibrium processes, critical phenomena, and quantum statistical mechanics. This course connects thermodynamic principles to current research in statistical physics and complex systems.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Advanced Statistical Mechanics',
      description: 'Rigorous mathematical foundations of statistical thermodynamics.',
      duration: '8h',
      completed: false,
      lectures: [
        {
          id: 'l1',
          title: 'Ensemble Theory and Phase Space',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/4i1MUWJoI0U'
        },
        {
          id: 'l2',
          title: 'Microcanonical, Canonical, and Grand Canonical Ensembles',
          type: 'video',
          duration: '65m',
          completed: false,
          url: 'https://www.youtube.com/embed/t7CUui1uy-c'
        },
        {
          id: 'l3',
          title: 'Advanced Quantum Statistics',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/Mt0ZV-AZQpQ'
        },
        {
          id: 'l4',
          title: 'Density Matrices and Quantum Ensembles',
          type: 'reading',
          duration: '60m',
          completed: false
        },
        {
          id: 'l5',
          title: 'Fluctuation-Dissipation Theorem',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/2_OKz_D9G2k'
        },
        {
          id: 'l6',
          title: 'Correlation Functions and Response Theory',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/lrPIPM68cJk'
        },
        {
          id: 'l7',
          title: 'Computational Statistical Mechanics',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/C_3Wj5_GwJo'
        }
        // {
        //   id: 'l8',
        //   title: 'Advanced Statistical Mechanics Problem Set',
        //   type: 'assignment',
        //   duration: '1h 45m',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Critical Phenomena and Phase Transitions',
      description: 'Advanced treatment of phase transitions and critical behavior.',
      duration: '8h',
      completed: false,
      lectures: [
        {
          id: 'l9',
          title: 'Landau Theory of Phase Transitions',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/1woV5lEQ-VE'
        },
        {
          id: 'l10',
          title: 'Critical Exponents and Universality',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/3LYHRKIo0tg'
        },
        {
          id: 'l11',
          title: 'Scaling Theory and the Renormalization Group',
          type: 'video',
          duration: '65m',
          completed: false,
          url: 'https://www.youtube.com/embed/40Kh9Lr-UEs'
        },
        {
          id: 'l12',
          title: 'Mean-Field Theories and Their Limitations',
          type: 'reading',
          duration: '50m',
          completed: false
        },
        {
          id: 'l13',
          title: 'Exactly Solvable Models in Statistical Mechanics',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/fUvH5GfvJUY'
        },
        {
          id: 'l14',
          title: 'First-Order and Continuous Phase Transitions',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/P_Zj6CT9ggk'
        },
        {
          id: 'l15',
          title: 'Quantum Phase Transitions',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/Ny1hKDpa8VM'
        }
        // {
        //   id: 'l16',
        //   title: 'Phase Transitions Research Project',
        //   type: 'assignment',
        //   duration: '2h',
        //   completed: false
        // }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Non-Equilibrium Thermodynamics',
      description: 'Theoretical foundations of irreversible processes and systems far from equilibrium.',
      duration: '8h',
      completed: false,
      lectures: [
        {
          id: 'l17',
          title: 'Irreversible Processes and Entropy Production',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/2sNjFlkgzqY'
        },
        {
          id: 'l18',
          title: 'Linear Response Theory',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/SFApci4nXLg'
        },
        {
          id: 'l19',
          title: 'Onsager Reciprocal Relations',
          type: 'reading',
          duration: '55m',
          completed: false
        },
        {
          id: 'l20',
          title: 'Transport Phenomena and Kinetic Theory',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/6tVVANX0FwQ'
        },
        {
          id: 'l21',
          title: 'Stochastic Processes and Fluctuations',
          type: 'video',
          duration: '55m',
          completed: false,
          url: 'https://www.youtube.com/embed/JC_QQJsWiT8'
        },
        {
          id: 'l22',
          title: 'Self-Organization and Dissipative Structures',
          type: 'video',
          duration: '60m',
          completed: false,
          url: 'https://www.youtube.com/embed/xuLVk9Pf4T8'
        },
        {
          id: 'l23',
          title: 'Thermodynamics of Computation',
          type: 'video',
          duration: '50m',
          completed: false,
          url: 'https://www.youtube.com/embed/Myj8ul4ID2I'
        },
        // {
        //   id: 'l24',
        //   title: 'Final Research Project on Non-Equilibrium Systems',
        //   type: 'assignment',
        //   duration: '2h',
        //   completed: false
        // },
        {
          id: 'l25',
          title: 'Final Course Assessment',
          type: 'assessment',
          duration: '45m',
          completed: false
        }
      ]
    }
  ]
}

};