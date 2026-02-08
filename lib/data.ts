// Career Compass - Mock Data and Types
// All data and type definitions for the MVP

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  position: { x: number; y: number };
  prerequisites?: string[];
  category: 'dsa' | 'projects' | 'fundamentals' | 'softSkills';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Resource {
  id: string;
  topic: string;
  title: string;
  type: 'free' | 'paid';
  url: string;
  description: string;
}

export interface PlacementOpening {
  id: string;
  company: string;
  role: string;
  location: string;
  type: 'internship' | 'full-time';
  salary: string;
  deadline: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  domain: 'frontend' | 'backend' | 'fullstack';
  skillLevels: {
    dsa: number;
    coreCS: number;
    frameworks: number;
  };
  projectsCompleted: number;
  placementTimeline: number;
  readinessScore: number;
}

export interface RankingData {
  userPercentile: number;
  collegeRank: number;
  totalStudents: number;
  collegeAverage: number;
  topPerformers: Array<{
    name: string;
    score: number;
    college: string;
  }>;
}

// ============================================================================
// MOCK DATA
// ============================================================================

// Frontend Roadmap
export const frontendRoadmap: RoadmapNode[] = [
  {
    id: 'internet',
    title: 'Internet Basics',
    description: 'How the internet works, HTTP/HTTPS, DNS, Browsers',
    completed: false,
    position: { x: 50, y: 10 },
    category: 'fundamentals',
    difficulty: 'easy',
  },
  {
    id: 'html',
    title: 'HTML',
    description: 'Semantic HTML, Forms, Accessibility',
    completed: false,
    position: { x: 50, y: 25 },
    prerequisites: ['internet'],
    category: 'fundamentals',
    difficulty: 'easy',
  },
  {
    id: 'css',
    title: 'CSS',
    description: 'Styling, Flexbox, Grid, Responsive Design',
    completed: false,
    position: { x: 50, y: 40 },
    prerequisites: ['html'],
    category: 'fundamentals',
    difficulty: 'medium',
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'ES6+, DOM Manipulation, Async/Await, Fetch API',
    completed: false,
    position: { x: 50, y: 55 },
    prerequisites: ['css'],
    category: 'dsa',
    difficulty: 'medium',
  },
  {
    id: 'git',
    title: 'Git & GitHub',
    description: 'Version Control, Branching, Collaboration',
    completed: false,
    position: { x: 50, y: 70 },
    prerequisites: ['javascript'],
    category: 'fundamentals',
    difficulty: 'easy',
  },
  {
    id: 'react',
    title: 'React',
    description: 'Components, Hooks, State Management, React Router',
    completed: false,
    position: { x: 50, y: 85 },
    prerequisites: ['git'],
    category: 'projects',
    difficulty: 'hard',
  },
];

// Mock Test Questions
export const mockQuestions: Record<string, TestQuestion[]> = {
  internet: [
    {
      id: 'q1',
      topic: 'internet',
      question: 'What does HTTP stand for?',
      options: [
        'HyperText Transfer Protocol',
        'High Transfer Text Protocol',
        'HyperText Transmission Process',
        'Home Tool Transfer Protocol',
      ],
      correctAnswer: 0,
      difficulty: 'easy',
    },
    {
      id: 'q2',
      topic: 'internet',
      question: 'What is the default port for HTTPS?',
      options: ['80', '443', '8080', '3000'],
      correctAnswer: 1,
      difficulty: 'medium',
    },
    {
      id: 'q3',
      topic: 'internet',
      question: 'What does DNS stand for?',
      options: [
        'Domain Name System',
        'Dynamic Network Service',
        'Domain Network Server',
        'Data Name System',
      ],
      correctAnswer: 0,
      difficulty: 'easy',
    },
    {
      id: 'q4',
      topic: 'internet',
      question: 'Which protocol is used to transfer web pages?',
      options: ['FTP', 'SMTP', 'HTTP', 'POP3'],
      correctAnswer: 2,
      difficulty: 'easy',
    },
    {
      id: 'q5',
      topic: 'internet',
      question: 'What is the purpose of a CDN?',
      options: [
        'To store user data',
        'To deliver content faster by using distributed servers',
        'To encrypt data',
        'To manage databases',
      ],
      correctAnswer: 1,
      difficulty: 'medium',
    },
  ],
  html: [
    {
      id: 'q6',
      topic: 'html',
      question: 'Which tag is used for the largest heading?',
      options: ['<head>', '<h6>', '<h1>', '<heading>'],
      correctAnswer: 2,
      difficulty: 'easy',
    },
    {
      id: 'q7',
      topic: 'html',
      question: 'What is semantic HTML?',
      options: [
        'HTML with inline styles',
        'HTML that clearly describes its meaning',
        'HTML written in JavaScript',
        'HTML with animations',
      ],
      correctAnswer: 1,
      difficulty: 'medium',
    },
    {
      id: 'q8',
      topic: 'html',
      question: 'Which attribute makes an input field required?',
      options: ['mandatory', 'required', 'need', 'validate'],
      correctAnswer: 1,
      difficulty: 'easy',
    },
    {
      id: 'q9',
      topic: 'html',
      question: 'What does the <section> tag represent?',
      options: [
        'A standalone piece of content',
        'A thematic grouping of content',
        'A navigation menu',
        'A footer section',
      ],
      correctAnswer: 1,
      difficulty: 'medium',
    },
    {
      id: 'q10',
      topic: 'html',
      question: 'Which tag is used to define metadata in HTML?',
      options: ['<meta>', '<data>', '<info>', '<header>'],
      correctAnswer: 0,
      difficulty: 'easy',
    },
  ],
  css: [
    {
      id: 'q11',
      topic: 'css',
      question: 'Which property is used to change background color?',
      options: ['bgcolor', 'color', 'background-color', 'bg-color'],
      correctAnswer: 2,
      difficulty: 'easy',
    },
    {
      id: 'q12',
      topic: 'css',
      question: 'What does "flex: 1" mean in Flexbox?',
      options: [
        'Fixed width of 1px',
        'Grow to fill available space',
        'Set opacity to 1',
        'Set z-index to 1',
      ],
      correctAnswer: 1,
      difficulty: 'medium',
    },
    {
      id: 'q13',
      topic: 'css',
      question: 'How do you make text bold in CSS?',
      options: [
        'font-weight: bold',
        'text-style: bold',
        'font: bold',
        'text-weight: bold',
      ],
      correctAnswer: 0,
      difficulty: 'easy',
    },
    {
      id: 'q14',
      topic: 'css',
      question: 'What is the default value of position property?',
      options: ['absolute', 'relative', 'static', 'fixed'],
      correctAnswer: 2,
      difficulty: 'medium',
    },
    {
      id: 'q15',
      topic: 'css',
      question: 'Which CSS property controls text size?',
      options: ['text-size', 'font-size', 'text-style', 'font-style'],
      correctAnswer: 1,
      difficulty: 'easy',
    },
  ],
  javascript: [
    {
      id: 'q16',
      topic: 'javascript',
      question: 'What does "const" keyword do?',
      options: [
        'Creates a constant variable that cannot be reassigned',
        'Creates a variable that can be changed',
        'Defines a function',
        'Creates a loop',
      ],
      correctAnswer: 0,
      difficulty: 'easy',
    },
    {
      id: 'q17',
      topic: 'javascript',
      question: 'What does "=== " check for?',
      options: [
        'Value only',
        'Type only',
        'Both value and type',
        'Neither value nor type',
      ],
      correctAnswer: 2,
      difficulty: 'medium',
    },
    {
      id: 'q18',
      topic: 'javascript',
      question: 'How do you declare an arrow function?',
      options: [
        'function => {}',
        '() => {}',
        'arrow function(){}',
        '=> function(){}',
      ],
      correctAnswer: 1,
      difficulty: 'easy',
    },
    {
      id: 'q19',
      topic: 'javascript',
      question: 'What is a Promise in JavaScript?',
      options: [
        'A loop structure',
        'An object representing eventual completion of async operation',
        'A type of variable',
        'A CSS property',
      ],
      correctAnswer: 1,
      difficulty: 'medium',
    },
    {
      id: 'q20',
      topic: 'javascript',
      question: 'Which method adds an element to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctAnswer: 0,
      difficulty: 'easy',
    },
  ],
  git: [
    {
      id: 'q21',
      topic: 'git',
      question: 'What command initializes a new Git repository?',
      options: ['git start', 'git init', 'git create', 'git new'],
      correctAnswer: 1,
      difficulty: 'easy',
    },
    {
      id: 'q22',
      topic: 'git',
      question: 'What does "git clone" do?',
      options: [
        'Deletes a repository',
        'Creates a copy of a remote repository',
        'Merges branches',
        'Commits changes',
      ],
      correctAnswer: 1,
      difficulty: 'easy',
    },
    {
      id: 'q23',
      topic: 'git',
      question: 'Which command shows the status of working directory?',
      options: ['git check', 'git status', 'git info', 'git show'],
      correctAnswer: 1,
      difficulty: 'easy',
    },
    {
      id: 'q24',
      topic: 'git',
      question: 'What is a "branch" in Git?',
      options: [
        'A separate line of development',
        'A type of commit',
        'A remote repository',
        'A file in repository',
      ],
      correctAnswer: 0,
      difficulty: 'medium',
    },
    {
      id: 'q25',
      topic: 'git',
      question: 'Which command pushes changes to remote repository?',
      options: ['git upload', 'git send', 'git push', 'git commit'],
      correctAnswer: 2,
      difficulty: 'easy',
    },
  ],
  react: [
    {
      id: 'q26',
      topic: 'react',
      question: 'What is JSX?',
      options: [
        'A CSS preprocessor',
        'JavaScript XML - syntax extension for JavaScript',
        'A database language',
        'A testing framework',
      ],
      correctAnswer: 1,
      difficulty: 'easy',
    },
    {
      id: 'q27',
      topic: 'react',
      question: 'Which hook is used for side effects?',
      options: ['useState', 'useEffect', 'useContext', 'useMemo'],
      correctAnswer: 1,
      difficulty: 'medium',
    },
    {
      id: 'q28',
      topic: 'react',
      question: 'What does useState return?',
      options: [
        'A single value',
        'An array with state and setter function',
        'An object',
        'A promise',
      ],
      correctAnswer: 1,
      difficulty: 'medium',
    },
    {
      id: 'q29',
      topic: 'react',
      question: 'What are props in React?',
      options: [
        'Properties passed from parent to child components',
        'A type of hook',
        'CSS classes',
        'State variables',
      ],
      correctAnswer: 0,
      difficulty: 'easy',
    },
    {
      id: 'q30',
      topic: 'react',
      question: 'What is the virtual DOM?',
      options: [
        'A real DOM element',
        'A lightweight copy of the actual DOM',
        'A CSS framework',
        'A type of component',
      ],
      correctAnswer: 1,
      difficulty: 'medium',
    },
  ],
};

// Resources
export const resources: Resource[] = [
  // Internet
  {
    id: 'r1',
    topic: 'internet',
    title: 'How Does the Internet Work?',
    type: 'free',
    url: 'https://web.stanford.edu/class/msande91si/www-spr04/readings/week1/InternetWhitepaper.htm',
    description: 'Comprehensive guide to internet fundamentals',
  },
  {
    id: 'r2',
    topic: 'internet',
    title: 'HTTP Crash Course',
    type: 'free',
    url: 'https://www.youtube.com/watch?v=iYM2zFP3Zn0',
    description: 'Video tutorial on HTTP protocol',
  },
  // HTML
  {
    id: 'r3',
    topic: 'html',
    title: 'MDN HTML Documentation',
    type: 'free',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    description: 'Complete HTML reference and tutorials',
  },
  {
    id: 'r4',
    topic: 'html',
    title: 'HTML & CSS Course (Udemy)',
    type: 'paid',
    url: 'https://www.udemy.com/course/design-and-develop-a-killer-website-with-html5-and-css3/',
    description: 'Comprehensive paid course on HTML & CSS',
  },
  // CSS
  {
    id: 'r5',
    topic: 'css',
    title: 'CSS Tricks',
    type: 'free',
    url: 'https://css-tricks.com/',
    description: 'Articles, guides, and snippets for CSS',
  },
  {
    id: 'r6',
    topic: 'css',
    title: 'Flexbox Froggy',
    type: 'free',
    url: 'https://flexboxfroggy.com/',
    description: 'Interactive game to learn Flexbox',
  },
  // JavaScript
  {
    id: 'r7',
    topic: 'javascript',
    title: 'JavaScript.info',
    type: 'free',
    url: 'https://javascript.info/',
    description: 'Modern JavaScript tutorial',
  },
  {
    id: 'r8',
    topic: 'javascript',
    title: 'JavaScript: The Complete Guide (Udemy)',
    type: 'paid',
    url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
    description: 'From beginner to advanced JavaScript',
  },
  // Git
  {
    id: 'r9',
    topic: 'git',
    title: 'Git Documentation',
    type: 'free',
    url: 'https://git-scm.com/doc',
    description: 'Official Git documentation',
  },
  {
    id: 'r10',
    topic: 'git',
    title: 'Learn Git Branching',
    type: 'free',
    url: 'https://learngitbranching.js.org/',
    description: 'Interactive Git tutorial',
  },
  // React
  {
    id: 'r11',
    topic: 'react',
    title: 'React Official Docs',
    type: 'free',
    url: 'https://react.dev/',
    description: 'Official React documentation',
  },
  {
    id: 'r12',
    topic: 'react',
    title: 'React - The Complete Guide (Udemy)',
    type: 'paid',
    url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
    description: 'Comprehensive React course with hooks and Redux',
  },
];

// Placement Openings
export const placementOpenings: PlacementOpening[] = [
  {
    id: 'p1',
    company: 'Google',
    role: 'Software Engineering Intern',
    location: 'Bangalore',
    type: 'internship',
    salary: '₹1,00,000/month',
    deadline: '2026-03-15',
  },
  {
    id: 'p2',
    company: 'Microsoft',
    role: 'Frontend Developer',
    location: 'Hyderabad',
    type: 'full-time',
    salary: '₹18 LPA',
    deadline: '2026-03-20',
  },
  {
    id: 'p3',
    company: 'Amazon',
    role: 'SDE-1',
    location: 'Bangalore',
    type: 'full-time',
    salary: '₹22 LPA',
    deadline: '2026-03-10',
  },
  {
    id: 'p4',
    company: 'Flipkart',
    role: 'UI/UX Developer Intern',
    location: 'Bangalore',
    type: 'internship',
    salary: '₹50,000/month',
    deadline: '2026-03-25',
  },
  {
    id: 'p5',
    company: 'Zomato',
    role: 'Full Stack Developer',
    location: 'Gurgaon',
    type: 'full-time',
    salary: '₹15 LPA',
    deadline: '2026-03-18',
  },
  {
    id: 'p6',
    company: 'Paytm',
    role: 'React Developer Intern',
    location: 'Noida',
    type: 'internship',
    salary: '₹40,000/month',
    deadline: '2026-03-22',
  },
];

// News Items
export const newsItems: NewsItem[] = [
  {
    id: 'n1',
    title: 'AI Revolution in 2026: What Students Need to Know',
    summary:
      'Latest trends in AI and how they impact software engineering roles in tech companies.',
    date: '2026-02-05',
    category: 'AI',
    imageUrl: '/api/placeholder/400/200',
  },
  {
    id: 'n2',
    title: 'Top Programming Languages for Placements 2026',
    summary:
      'Analysis of most in-demand programming languages based on recent placement drives.',
    date: '2026-02-03',
    category: 'Tech',
    imageUrl: '/api/placeholder/400/200',
  },
  {
    id: 'n3',
    title: 'IIT Madras Reports Record Placements',
    summary:
      'Highest CTC reaches ₹2.5 Cr as tech companies ramp up hiring from premier institutes.',
    date: '2026-02-01',
    category: 'Placements',
    imageUrl: '/api/placeholder/400/200',
  },
  {
    id: 'n4',
    title: 'Remote Work Opportunities Surge in Tech Sector',
    summary:
      'Companies offering more remote positions for fresh graduates, expanding opportunities.',
    date: '2026-01-30',
    category: 'Tech',
    imageUrl: '/api/placeholder/400/200',
  },
  {
    id: 'n5',
    title: 'How to Ace Your Technical Interview',
    summary:
      'Expert tips and common pitfalls to avoid in coding interviews for placement season.',
    date: '2026-01-28',
    category: 'Placements',
    imageUrl: '/api/placeholder/400/200',
  },
  {
    id: 'n6',
    title: 'OpenAI Launches New Developer Tools',
    summary:
      'Latest AI tools and APIs that are changing how developers build applications.',
    date: '2026-01-25',
    category: 'AI',
    imageUrl: '/api/placeholder/400/200',
  },
];

// Default user profile
export const defaultUserProfile: UserProfile = {
  name: 'Student',
  domain: 'frontend',
  skillLevels: {
    dsa: 50,
    coreCS: 60,
    frameworks: 40,
  },
  projectsCompleted: 2,
  placementTimeline: 90,
  readinessScore: 45,
};

// Mock ranking data
export const rankingData: RankingData = {
  userPercentile: 68,
  collegeRank: 12,
  totalStudents: 450,
  collegeAverage: 52,
  topPerformers: [
    { name: 'Rahul S.', score: 92, college: 'Your College' },
    { name: 'Priya K.', score: 88, college: 'Your College' },
    { name: 'Amit P.', score: 85, college: 'Your College' },
  ],
};
