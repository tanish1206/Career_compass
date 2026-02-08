// Central User State Types

export interface UserState {
    userId: string;
    profile: UserProfile;
    skills: Skills;
    roadmap: RoadmapState;
    projects: Project[];
    mockTests: MockTestResult[];
    metadata: Metadata;
}

export interface UserProfile {
    name: string;
    email: string;
    college: string;
    role: string; // "Frontend Developer", "Backend Developer", etc.
}

export interface Skills {
    dsa: number;          // 0-100
    projects: number;     // 0-100
    fundamentals: number; // 0-100
    softSkills: number;   // 0-100
}

export interface RoadmapState {
    topics: RoadmapTopic[];
    source: 'default' | 'ai' | 'system';
    lastUpdated: string;
}

export interface RoadmapTopic {
    id: string;
    title: string;
    description: string;
    category: 'dsa' | 'projects' | 'fundamentals' | 'softSkills';
    difficulty: 'easy' | 'medium' | 'hard';
    completed: boolean;
    completedAt?: string;
    prerequisites?: string[];
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    completed: boolean;
    completedAt?: string;
}

export interface MockTestResult {
    id: string;
    topic: string;
    category: 'dsa' | 'fundamentals'; // Maps to skill category
    score: number; // 0-100
    totalQuestions: number;
    correctAnswers: number;
    completedAt: string;
}

export interface Metadata {
    createdAt: string;
    lastActive: string;
    version: string;
}

// Derived Metrics (calculated, never stored)
export interface DerivedMetrics {
    readinessScore: number;
    roadmapProgress: number;
    weakestSkill: {
        name: string;
        value: number;
    };
    strongestSkill: {
        name: string;
        value: number;
    };
    completedTopicsCount: number;
    totalTopicsCount: number;
    completedProjectsCount: number;
    averageMockTestScore: number;
    skillsAverage: number;
}

// Skill difficulty weights
export const SKILL_INCREASE = {
    easy: 3,
    medium: 5,
    hard: 8,
} as const;

// Readiness score weights
export const READINESS_WEIGHTS = {
    skills: 0.4,
    roadmap: 0.3,
    projects: 0.2,
    mockTests: 0.1,
} as const;
