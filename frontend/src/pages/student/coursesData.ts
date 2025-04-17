// coursesData.ts
export interface Lecture {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
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
  '1': {
    id: '1',
    title: 'Advanced Mathematics',
    subject: 'Mathematics',
    instructor: 'Dr. Ahmed Khan',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    rating: 4.8,
    studentsEnrolled: 1250,
    duration: '24 hours',
    progress: 35,
    totalModules: 4,
    completedModules: 2,
    totalHours: 24,
    description: 'This comprehensive course on Advanced Mathematics covers calculus fundamentals, including differentiation, integration, and their applications in real-world scenarios.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Introduction to Calculus',
        description: 'The basics of differential calculus and its applications.',
        duration: '5h 20m',
        completed: true,
        lectures: [
          {
            id: 'l1',
            title: 'Introduction to the Course',
            type: 'video',
            duration: '15m',
            completed: true,
            url: 'https://www.youtube.com/embed/WUvTyaaNkzM'
          },
          {
            id: 'l2',
            title: 'What is Calculus?',
            type: 'video',
            duration: '25m',
            completed: true,
            url: 'https://www.youtube.com/embed/HfACrKJ_Y2w'
          },
          {
            id: 'l3',
            title: 'Limits and Continuity',
            type: 'reading',
            duration: '40m',
            completed: true
          },
          {
            id: 'l4',
            title: 'Functions and Their Graphs',
            type: 'video',
            duration: '30m',
            completed: true,
            url: 'https://www.youtube.com/embed/9vZa0dQfGe0'
          },
          {
            id: 'l5',
            title: 'Module 1 Quiz',
            type: 'quiz',
            duration: '30m',
            completed: true
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Derivatives',
        description: 'Understanding derivatives and their properties.',
        duration: '6h 45m',
        completed: true,
        lectures: [
          {
            id: 'l6',
            title: 'Definition of the Derivative',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/rAof9Ld5sOg'
          },
          {
            id: 'l7',
            title: 'Rules of Differentiation',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/O8xoEKvE-MU'
          },
          {
            id: 'l8',
            title: 'Chain Rule and Implicit Differentiation',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/0DJq81B-aCY'
          },
          {
            id: 'l9',
            title: 'Applications of Derivatives',
            type: 'reading',
            duration: '50m',
            completed: true
          },
          {
            id: 'l10',
            title: 'Derivative Problem Set',
            type: 'assignment',
            duration: '1h 30m',
            completed: true
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Integrals',
        description: 'Introduction to integration and the fundamental theorem of calculus.',
        duration: '7h 10m',
        completed: false,
        lectures: [
          {
            id: 'l11',
            title: 'Introduction to Integrals',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/rfG8ce4nNh0'
          },
          {
            id: 'l12',
            title: 'Indefinite Integrals',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/q87L9R9v274'
          },
          {
            id: 'l13',
            title: 'Definite Integrals',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/1RLctDS2hUQ'
          },
          {
            id: 'l14',
            title: 'Integration Techniques',
            type: 'reading',
            duration: '1h',
            completed: false
          },
          {
            id: 'l15',
            title: 'Module 3 Mid-Assessment',
            type: 'quiz',
            duration: '30m',
            completed: false
          },
          {
            id: 'l16',
            title: 'Module 3 Final Assignment',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      },
      {
        id: 'm4',
        title: 'Module 4: Applications of Integration',
        description: 'Real-world applications of integrals and advanced integration concepts.',
        duration: '4h 45m',
        completed: false,
        lectures: [
          {
            id: 'l17',
            title: 'Area Between Curves',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/WLHgWwNlZHk'
          },
          {
            id: 'l18',
            title: 'Volume of Solids of Revolution',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/QL0btScXXwI'
          },
          {
            id: 'l19',
            title: 'Applications in Physics and Engineering',
            type: 'reading',
            duration: '50m',
            completed: false
          },
          {
            id: 'l20',
            title: 'Final Course Assessment',
            type: 'quiz',
            duration: '1h',
            completed: false
          }
        ]
      }
    ]
  },

  '2': {
    id: '2',
    title: 'Introduction to Physics',
    subject: 'Physics',
    instructor: 'Prof. Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa',
    rating: 4.6,
    studentsEnrolled: 980,
    duration: '20 hours',
    progress: 75,
    totalModules: 4,
    completedModules: 3,
    totalHours: 20,
    description: 'Explore the fundamental principles of physics, from classical mechanics to modern quantum theory, with practical applications and interactive experiments.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Classical Mechanics',
        description: 'Foundations of motion, forces, and energy in classical physics.',
        duration: '6h',
        completed: true,
        lectures: [
          {
            id: 'l1',
            title: 'Introduction to Physics',
            type: 'video',
            duration: '30m',
            completed: true,
            url: 'https://www.youtube.com/embed/ZM8ECpBuQYE'
          },
          {
            id: 'l2',
            title: 'Newton\'s Laws of Motion',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/kKKM8Y-u7ds'
          },
          {
            id: 'l3',
            title: 'Work, Energy, and Power',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/w4QFJb9a8vo'
          },
          {
            id: 'l4',
            title: 'Momentum and Collisions',
            type: 'reading',
            duration: '50m',
            completed: true
          },
          {
            id: 'l5',
            title: 'Mechanics Problem Set',
            type: 'assignment',
            duration: '1h 15m',
            completed: true
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Thermodynamics',
        description: 'Heat, temperature, and energy transfer principles.',
        duration: '5h 30m',
        completed: true,
        lectures: [
          {
            id: 'l6',
            title: 'Temperature and Heat',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/Xb05CaG7TsQ'
          },
          {
            id: 'l7',
            title: 'Laws of Thermodynamics',
            type: 'video',
            duration: '50m',
            completed: true,
            url: 'https://www.youtube.com/embed/VHSy5QTMQsI'
          },
          {
            id: 'l8',
            title: 'Heat Engines and Entropy',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/kLqduWF6GXE'
          },
          {
            id: 'l9',
            title: 'Thermodynamics Quiz',
            type: 'quiz',
            duration: '40m',
            completed: true
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Electromagnetism',
        description: 'Electric and magnetic fields, forces, and their practical applications.',
        duration: '5h 30m',
        completed: true,
        lectures: [
          {
            id: 'l10',
            title: 'Electric Charges and Fields',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/mdulzEfQXDE'
          },
          {
            id: 'l11',
            title: 'Electric Potential and Capacitance',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/RGvvbzPJB5k'
          },
          {
            id: 'l12',
            title: 'Magnetic Fields and Forces',
            type: 'video',
            duration: '50m',
            completed: true,
            url: 'https://www.youtube.com/embed/s94suB5uLWw'
          },
          {
            id: 'l13',
            title: 'Electromagnetic Induction',
            type: 'reading',
            duration: '45m',
            completed: true
          },
          {
            id: 'l14',
            title: 'Electromagnetism Assignment',
            type: 'assignment',
            duration: '1h',
            completed: true
          }
        ]
      },
      {
        id: 'm4',
        title: 'Module 4: Modern Physics',
        description: 'Introduction to quantum mechanics and relativity.',
        duration: '3h',
        completed: false,
        lectures: [
          {
            id: 'l15',
            title: 'Special Relativity',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/AwhKZ3fd9JA'
          },
          {
            id: 'l16',
            title: 'Quantum Physics Basics',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/7s0aYmqzOPM'
          },
          {
            id: 'l17',
            title: 'Atomic Structure',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l18',
            title: 'Final Course Exam',
            type: 'quiz',
            duration: '45m',
            completed: false
          }
        ]
      }
    ]
  },

  '3': {
    id: '3',
    title: 'Organic Chemistry',
    subject: 'Chemistry',
    instructor: 'Dr. Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6',
    rating: 4.5,
    studentsEnrolled: 820,
    duration: '18 hours',
    progress: 60,
    totalModules: 3,
    completedModules: 2,
    totalHours: 18,
    description: 'Understand the principles of organic chemistry, including molecular structures, reaction mechanisms, and synthesis methods for various organic compounds.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Fundamentals of Organic Chemistry',
        description: 'Introduction to organic molecules, structures, and bonding.',
        duration: '6h 30m',
        completed: true,
        lectures: [
          {
            id: 'l1',
            title: 'Introduction to Organic Chemistry',
            type: 'video',
            duration: '35m',
            completed: true,
            url: 'https://www.youtube.com/embed/4QyYKi0JjQ0'
          },
          {
            id: 'l2',
            title: 'Carbon Bonding and Hybridization',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/h_fIX6NZH6U'
          },
          {
            id: 'l3',
            title: 'Functional Groups in Organic Chemistry',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/YTMj28wt9Tc'
          },
          {
            id: 'l4',
            title: 'IUPAC Nomenclature Rules',
            type: 'reading',
            duration: '55m',
            completed: true
          },
          {
            id: 'l5',
            title: 'Structure Drawing and Identification',
            type: 'assignment',
            duration: '1h 15m',
            completed: true
          },
          {
            id: 'l6',
            title: 'Module 1 Assessment',
            type: 'quiz',
            duration: '40m',
            completed: true
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Aliphatic Compounds',
        description: 'Study of alkanes, alkenes, alkynes, and their reactions.',
        duration: '6h 15m',
        completed: true,
        lectures: [
          {
            id: 'l7',
            title: 'Properties of Alkanes',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/WlfQvkda_VE'
          },
          {
            id: 'l8',
            title: 'Alkenes and Addition Reactions',
            type: 'video',
            duration: '50m',
            completed: true,
            url: 'https://www.youtube.com/embed/0DAXaEQV8S8'
          },
          {
            id: 'l9',
            title: 'Alkynes and Their Chemistry',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/6-v7sJ_5vco'
          },
          {
            id: 'l10',
            title: 'Stereochemistry and Isomerism',
            type: 'reading',
            duration: '1h',
            completed: true
          },
          {
            id: 'l11',
            title: 'Reaction Mechanisms Lab',
            type: 'assignment',
            duration: '1h 30m',
            completed: true
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Aromatic Compounds and Reactions',
        description: 'Benzene, aromatic reactions, and synthesis strategies.',
        duration: '5h 15m',
        completed: false,
        lectures: [
          {
            id: 'l12',
            title: 'Benzene and Aromaticity',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/A8RNl_CRXFA'
          },
          {
            id: 'l13',
            title: 'Electrophilic Aromatic Substitution',
            type: 'video',
            duration: '55m',
            completed: true,
            url: 'https://www.youtube.com/embed/P1ato6nQcSY'
          },
          {
            id: 'l14',
            title: 'Effects of Substituents',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l15',
            title: 'Synthetic Applications',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/1QUERQRJk0w'
          },
          {
            id: 'l16',
            title: 'Final Synthesis Project',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      }
    ]
  },

  '4': {
    id: '4',
    title: 'English Literature',
    subject: 'Literature',
    instructor: 'Dr. Emily Wilson',
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765',
    rating: 4.7,
    studentsEnrolled: 750,
    duration: '15 hours',
    progress: 20,
    totalModules: 3,
    completedModules: 1,
    totalHours: 15,
    description: 'A journey through classic and contemporary literature, analyzing themes, styles, and historical contexts across different literary movements.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Introduction to Literary Analysis',
        description: 'Fundamental concepts and approaches to analyzing literature.',
        duration: '5h',
        completed: true,
        lectures: [
          {
            id: 'l1',
            title: 'What is Literature?',
            type: 'video',
            duration: '30m',
            completed: true,
            url: 'https://www.youtube.com/embed/FTpCTYUTHN4'
          },
          {
            id: 'l2',
            title: 'Elements of Fiction',
            type: 'video',
            duration: '45m',
            completed: true,
            url: 'https://www.youtube.com/embed/T0sGP5IvR7A'
          },
          {
            id: 'l3',
            title: 'Critical Approaches to Literature',
            type: 'reading',
            duration: '50m',
            completed: true
          },
          {
            id: 'l4',
            title: 'Close Reading Techniques',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/I_ab_KFnNPk'
          },
          {
            id: 'l5',
            title: 'First Critical Analysis Essay',
            type: 'assignment',
            duration: '1h 30m',
            completed: true
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Classical and Renaissance Literature',
        description: 'Exploring ancient Greek, Roman, and Renaissance literary masterpieces.',
        duration: '5h 30m',
        completed: false,
        lectures: [
          {
            id: 'l6',
            title: 'Greek Tragedy and Comedy',
            type: 'video',
            duration: '40m',
            completed: true,
            url: 'https://www.youtube.com/embed/H9Jz_bQ2iOk'
          },
          {
            id: 'l7',
            title: 'Shakespeare\'s Plays and Sonnets',
            type: 'video',
            duration: '55m',
            completed: true,
            url: 'https://www.youtube.com/embed/D9o5uqHLHMY'
          },
          {
            id: 'l8',
            title: 'Milton\'s Paradise Lost',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l9',
            title: 'Renaissance Poetry Analysis',
            type: 'quiz',
            duration: '35m',
            completed: false
          },
          {
            id: 'l10',
            title: 'Comparative Essay Assignment',
            type: 'assignment',
            duration: '1h 45m',
            completed: false
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Modern and Contemporary Literature',
        description: 'Examining literary movements from the 19th century to the present.',
        duration: '4h 30m',
        completed: false,
        lectures: [
          {
            id: 'l11',
            title: 'The Rise of the Novel',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/2c9RVvgV_Cw'
          },
          {
            id: 'l12',
            title: 'Modernism in Literature',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/rD2SiuGfPAk'
          },
          {
            id: 'l13',
            title: 'Post-Colonial Literature',
            type: 'reading',
            duration: '50m',
            completed: false
          },
          {
            id: 'l14',
            title: 'Contemporary Fiction',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/yZclxG2bcNE'
          },
          {
            id: 'l15',
            title: 'Final Literary Analysis Project',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      }
    ]
  },

  '5': {
    id: '5',
    title: 'Advanced Physics',
    subject: 'Physics',
    instructor: 'Prof. Richard Feynman',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    rating: 4.9,
    studentsEnrolled: 2300,
    duration: '22 hours',
    totalModules: 3,
    totalHours: 22,
    description: 'Delve deep into advanced physics concepts, including quantum mechanics, relativity, and particle physics with theoretical foundations and experimental applications.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Quantum Mechanics Fundamentals',
        description: 'Core principles and mathematical foundations of quantum theory.',
        duration: '8h',
        completed: false,
        lectures: [
          {
            id: 'l1',
            title: 'The Quantum Revolution',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/7s0aYmqzOPM'
          },
          {
            id: 'l2',
            title: 'Wave-Particle Duality',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/Ei8CFin00PY'
          },
          {
            id: 'l3',
            title: 'Schrödinger Equation',
            type: 'video',
            duration: '55m',
            completed: false,
            url: 'https://www.youtube.com/embed/O6g-7rUgrdg'
          },
          {
            id: 'l4',
            title: 'Quantum Operators and Measurement',
            type: 'reading',
            duration: '1h',
            completed: false
          },
          {
            id: 'l5',
            title: 'Quantum Harmonic Oscillator',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/tlfcnw81eFo'
          },
          {
            id: 'l6',
            title: 'Quantum Mechanics Problem Set',
            type: 'assignment',
            duration: '2h',
            completed: false
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Special and General Relativity',
        description: 'Einstein\'s theories and their implications for space, time, and gravity.',
        duration: '7h',
        completed: false,
        lectures: [
          {
            id: 'l7',
            title: 'Introduction to Special Relativity',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/AwhKZ3fd9JA'
          },
          {
            id: 'l8',
            title: 'Time Dilation and Length Contraction',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/yuD34tEpRFw'
          },
          {
            id: 'l9',
            title: 'Spacetime and Four-Vectors',
            type: 'reading',
            duration: '55m',
            completed: false
          },
          {
            id: 'l10',
            title: 'Introduction to General Relativity',
            type: 'video',
            duration: '1h',
            completed: false,
            url: 'https://www.youtube.com/embed/AwhKZ3fd9JA'
          },
          {
            id: 'l11',
            title: 'Curved Spacetime and Gravity',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/DYq774z4dws'
          },
          {
            id: 'l12',
            title: 'Relativity Assessment',
            type: 'quiz',
            duration: '45m',
            completed: false
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Particle Physics and the Standard Model',
        description: 'Subatomic particles, forces, and the current theoretical framework.',
        duration: '7h',
        completed: false,
        lectures: [
          {
            id: 'l13',
            title: 'Elementary Particles Overview',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/Vi530U7WE9E'
          },
          {
            id: 'l14',
            title: 'Fundamental Forces and Exchange Particles',
            type: 'video',
            duration: '55m',
            completed: false,
            url: 'https://www.youtube.com/embed/FLcvX_sXjsM'
          },
          {
            id: 'l15',
            title: 'The Standard Model',
            type: 'reading',
            duration: '1h',
            completed: false
          },
          {
            id: 'l16',
            title: 'Quantum Field Theory Introduction',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/x-8qwGTVIL0'
          },
          {
            id: 'l17',
            title: 'Beyond the Standard Model',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/41HjqRJBGPo'
          },
          {
            id: 'l18',
            title: 'Final Course Research Project',
            type: 'assignment',
            duration: '2h',
            completed: false
          }
        ]
      }
    ]
  },

  '6': {
    id: '6',
    title: 'Introduction to Computer Science',
    subject: 'Computer Science',
    instructor: 'Dr. Alan Turing',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    rating: 4.8,
    studentsEnrolled: 3100,
    duration: '20 hours',
    totalModules: 4,
    totalHours: 20,
    description: 'Learn the foundations of computer science, including programming concepts, algorithms, data structures, and computational thinking skills.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Introduction to Programming Fundamentals',
        description: 'Core programming concepts and problem-solving approaches.',
        duration: '5h',
        completed: false,
        lectures: [
          {
            id: 'l1',
            title: 'What is Computer Science?',
            type: 'video',
            duration: '30m',
            completed: false,
            url: 'https://www.youtube.com/embed/SzJ46YA_RaA'
          },
          {
            id: 'l2',
            title: 'Variables, Data Types, and Operators',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/7WiPGP_0AUA'
          },
          {
            id: 'l3',
            title: 'Control Flow: Conditionals and Loops',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/aEYcmNhz7Uc'
          },
          {
            id: 'l4',
            title: 'Functions and Modularity',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l5',
            title: 'Basic Programming Exercises',
            type: 'assignment',
            duration: '1h 15m',
            completed: false
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Data Structures',
        description: 'Fundamental data structures and their implementations.',
        duration: '5h 30m',
        completed: false,
        lectures: [
          {
            id: 'l6',
            title: 'Arrays and Lists',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/n1R8u4Vn6MU'
          },
          {
            id: 'l7',
            title: 'Stacks and Queues',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/wjI1WNcIntg'
          },
          {
            id: 'l8',
            title: 'Trees and Graphs',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/oSWTXtMglKE'
          },
          {
            id: 'l9',
            title: 'Hash Tables',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l10',
            title: 'Data Structures Implementation Project',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Algorithms',
        description: 'Design and analysis of fundamental algorithms.',
        duration: '5h',
        completed: false,
        lectures: [
          {
            id: 'l11',
            title: 'Algorithm Analysis and Big O Notation',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/v4cd1O4zkGw'
          },
          {
            id: 'l12',
            title: 'Sorting Algorithms',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/kPRA0W1kECg'
          },
          {
            id: 'l13',
            title: 'Searching Algorithms',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l14',
            title: 'Recursion and Dynamic Programming',
            type: 'video',
            duration: '55m',
            completed: false,
            url: 'https://www.youtube.com/embed/oBt53YbR9Kk'
          },
          {
            id: 'l15',
            title: 'Algorithm Challenge',
            type: 'quiz',
            duration: '45m',
            completed: false
          }
        ]
      },
      {
        id: 'm4',
        title: 'Module 4: Introduction to Software Engineering',
        description: 'Software development lifecycle and best practices.',
        duration: '4h 30m',
        completed: false,
        lectures: [
          {
            id: 'l16',
            title: 'Software Development Process',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/O753uuutqH8'
          },
          {
            id: 'l17',
            title: 'Version Control with Git',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/RGOj5yH7evk'
          },
          {
            id: 'l18',
            title: 'Testing and Debugging',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l19',
            title: 'Final Project: Building a Simple Application',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      }
    ]
  },

  '7': {
    id: '7',
    title: 'World History',
    subject: 'History',
    instructor: 'Prof. James Peterson',
    thumbnail: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882',
    rating: 4.6,
    studentsEnrolled: 1200,
    duration: '18 hours',
    totalModules: 4,
    totalHours: 18,
    description: 'An overview of major world civilizations and historical events from ancient times to the present day, examining cultural, political, and social developments.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Ancient Civilizations',
        description: 'The rise of early human societies and ancient empires.',
        duration: '4h 30m',
        completed: false,
        lectures: [
          {
            id: 'l1',
            title: 'Prehistoric Humans and Early Societies',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/BEt2a_brKx0'
          },
          {
            id: 'l2',
            title: 'Mesopotamia and Ancient Egypt',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/EvyjN9BCCnw'
          },
          {
            id: 'l3',
            title: 'Ancient Greece',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/gFRxmi4uZ1o'
          },
          {
            id: 'l4',
            title: 'The Roman Empire',
            type: 'reading',
            duration: '50m',
            completed: false
          },
          {
            id: 'l5',
            title: 'Ancient Civilizations Assessment',
            type: 'quiz',
            duration: '40m',
            completed: false
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Medieval Period and Renaissance',
        description: 'From the fall of Rome to the dawn of the modern era.',
        duration: '4h 45m',
        completed: false,
        lectures: [
          {
            id: 'l6',
            title: 'The Middle Ages in Europe',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/VtDFYSU94QM'
          },
          {
            id: 'l7',
            title: 'Islamic Golden Age',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/X0QkaP1_5JQ'
          },
          {
            id: 'l8',
            title: 'Medieval Asia: China and Japan',
            type: 'reading',
            duration: '50m',
            completed: false
          },
          {
            id: 'l9',
            title: 'The Renaissance and Reformation',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/fI1OGmCK6Ck'
          },
          {
            id: 'l10',
            title: 'Medieval Period Essay',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Age of Revolutions',
        description: 'Political, industrial, and social revolutions that shaped the modern world.',
        duration: '4h 45m',
        completed: false,
        lectures: [
          {
            id: 'l11',
            title: 'The Enlightenment',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/NnoFj2cMRLY'
          },
          {
            id: 'l12',
            title: 'American and French Revolutions',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/wIJU2VbhZQE'
          },
          {
            id: 'l13',
            title: 'The Industrial Revolution',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l14',
            title: 'Nationalism and Imperialism',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/EELx6dtR0MU'
          },
          {
            id: 'l15',
            title: 'Revolutions Quiz',
            type: 'quiz',
            duration: '35m',
            completed: false
          }
        ]
      },
      {
        id: 'm4',
        title: 'Module 4: The Modern World',
        description: 'World Wars, Cold War, and contemporary global developments.',
        duration: '4h',
        completed: false,
        lectures: [
          {
            id: 'l16',
            title: 'World War I',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/dHSQAEam2yc'
          },
          {
            id: 'l17',
            title: 'World War II',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/Objl5r4nITQ'
          },
          {
            id: 'l18',
            title: 'Cold War Era',
            type: 'reading',
            duration: '40m',
            completed: false
          },
          {
            id: 'l19',
            title: 'Globalization and the Contemporary World',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/JJ0nFD19eT8'
          },
          {
            id: 'l20',
            title: 'Final Historical Analysis Project',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      }
    ]
  },

  '8': {
    id: '8',
    title: 'Introduction to Psychology',
    subject: 'Psychology',
    instructor: 'Dr. Maria Rodriguez',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    rating: 4.5,
    studentsEnrolled: 2700,
    duration: '16 hours',
    totalModules: 3,
    totalHours: 16,
    description: 'Explore the human mind and behavior through the lens of modern psychological theories and research methods, covering cognitive processes, development, and disorders.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Foundations of Psychology',
        description: 'History, research methods, and major theoretical perspectives.',
        duration: '5h 30m',
        completed: false,
        lectures: [
          {
            id: 'l1',
            title: 'Introduction to Psychology',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/vo4pMVb0R6M'
          },
          {
            id: 'l2',
            title: 'History of Psychological Science',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/OZBmXI7JpWU'
          },
          {
            id: 'l3',
            title: 'Research Methods in Psychology',
            type: 'reading',
            duration: '50m',
            completed: false
          },
          {
            id: 'l4',
            title: 'The Brain and Nervous System',
            type: 'video',
            duration: '55m',
            completed: false,
            url: 'https://www.youtube.com/embed/kMKc8nfPATI'
          },
          {
            id: 'l5',
            title: 'Major Psychological Perspectives',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/iCb7MnD-1xI'
          },
          {
            id: 'l6',
            title: 'Foundation Concepts Quiz',
            type: 'quiz',
            duration: '35m',
            completed: false
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Cognitive and Developmental Psychology',
        description: 'Mental processes, learning, memory, and human development.',
        duration: '5h 30m',
        completed: false,
        lectures: [
          {
            id: 'l7',
            title: 'Sensation and Perception',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/unWnZvXJH2o'
          },
          {
            id: 'l8',
            title: 'Memory and Learning',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/bSycdIx-C48'
          },
          {
            id: 'l9',
            title: 'Language and Thought',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l10',
            title: 'Human Development Across the Lifespan',
            type: 'video',
            duration: '55m',
            completed: false,
            url: 'https://www.youtube.com/embed/4ZCubS6MPqw'
          },
          {
            id: 'l11',
            title: 'Cognitive Psychology Case Study',
            type: 'assignment',
            duration: '1h 15m',
            completed: false
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Social Psychology and Mental Health',
        description: 'Social influences, personality, and psychological disorders.',
        duration: '5h',
        completed: false,
        lectures: [
          {
            id: 'l12',
            title: 'Social Influence and Group Behavior',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/UGxGDdQnC1Y'
          },
          {
            id: 'l13',
            title: 'Personality Theories',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/ZaZkvvB367I'
          },
          {
            id: 'l14',
            title: 'Psychological Disorders',
            type: 'reading',
            duration: '55m',
            completed: false
          },
          {
            id: 'l15',
            title: 'Therapeutic Approaches',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/6nEL44QkL9w'
          },
          {
            id: 'l16',
            title: 'Final Psychology Research Project',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      }
    ]
  },

  '9': {
    id: '9',
    title: 'Principles of Economics',
    subject: 'Economics',
    instructor: 'Prof. Robert Chen',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
    rating: 4.7,
    studentsEnrolled: 1850,
    duration: '18 hours',
    totalModules: 3,
    totalHours: 18,
    description: 'An introduction to both microeconomics and macroeconomics, covering market structures, fiscal policy, monetary systems, and international trade.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Introduction to Economic Concepts',
        description: 'Fundamental economic principles and thinking.',
        duration: '6h',
        completed: false,
        lectures: [
          {
            id: 'l1',
            title: 'What is Economics?',
            type: 'video',
            duration: '35m',
            completed: false,
            url: 'https://www.youtube.com/embed/3ez10ADR_gM'
          },
          {
            id: 'l2',
            title: 'Scarcity, Choice, and Opportunity Cost',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/MKapGVMRlnI'
          },
          {
            id: 'l3',
            title: 'Supply and Demand',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/g9uUIUqhrSQ'
          },
          {
            id: 'l4',
            title: 'Market Equilibrium',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l5',
            title: 'Elasticity and Its Applications',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/4x_ehRilpek'
          },
          {
            id: 'l6',
            title: 'Economic Concepts Assessment',
            type: 'quiz',
            duration: '40m',
            completed: false
          },
          {
            id: 'l7',
            title: 'Supply and Demand Analysis Project',
            type: 'assignment',
            duration: '1h 15m',
            completed: false
          }
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Microeconomics',
        description: 'Individual market behaviors and firm decision making.',
        duration: '6h',
        completed: false,
        lectures: [
          {
            id: 'l8',
            title: 'Consumer Theory',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/Xe4dq7I_NGs'
          },
          {
            id: 'l9',
            title: 'Production and Costs',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/nCSF7Bny-fM'
          },
          {
            id: 'l10',
            title: 'Perfect Competition',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l11',
            title: 'Monopoly and Market Power',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/mEtmTtE6LSQ'
          },
          {
            id: 'l12',
            title: 'Game Theory and Strategic Behavior',
            type: 'video',
            duration: '40m',
            completed: false,
            url: 'https://www.youtube.com/embed/PCcVODWm-oY'
          },
          {
            id: 'l13',
            title: 'Market Structure Analysis',
            type: 'assignment',
            duration: '1h 30m',
            completed: false
          }
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Macroeconomics',
        description: 'National economic performance, policy, and global interactions.',
        duration: '6h',
        completed: false,
        lectures: [
          {
            id: 'l14',
            title: 'Measuring Economic Performance',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/rGXRtwt1Y5o'
          },
          {
            id: 'l15',
            title: 'Aggregate Demand and Supply',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/6bMZFKehK2s'
          },
          {
            id: 'l16',
            title: 'Fiscal Policy',
            type: 'reading',
            duration: '45m',
            completed: false
          },
          {
            id: 'l17',
            title: 'Monetary Policy and Banking',
            type: 'video',
            duration: '50m',
            completed: false,
            url: 'https://www.youtube.com/embed/F0XUzGijraQ'
          },
          {
            id: 'l18',
            title: 'International Trade and Finance',
            type: 'video',
            duration: '45m',
            completed: false,
            url: 'https://www.youtube.com/embed/WkbQrCNR90E'
          },
          {
            id: 'l19',
            title: 'Economic Policy Analysis',
            type: 'assignment',
            duration: '1h 15m',
            completed: false
          },
          {
            id: 'l20',
            title: 'Final Economics Assessment',
            type: 'quiz',
            duration: '45m',
            completed: false
          }
        ]
      }
    ]
  }
};