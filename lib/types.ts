// TypeScript interfaces for Career Compass
// These types define the data structure for the application
// TODO: Sync these with Supabase database schema when integrating backend

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  position: { x: number; y: number };
  prerequisites?: string[];
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
  category: 'AI' | 'Tech' | 'Placements';
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
  topPerformers: {
    name: string;
    score: number;
    college: string;
  }[];
}
