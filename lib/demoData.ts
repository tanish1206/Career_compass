import { UserState, RoadmapTopic, Project, MockTestResult } from './types/userState';
import { frontendRoadmap } from './data';

/**
 * Generates a demo user with pre-populated data for first-time visitors
 */
export function createDemoUser(): UserState {
    const now = new Date().toISOString();

    // Clone roadmap and mark first 2 topics as completed
    const demoRoadmap: RoadmapTopic[] = frontendRoadmap.map((topic, index) => ({
        ...topic,
        completed: index < 2, // First 2 topics completed
        completedAt: index < 2 ? new Date(Date.now() - (2 - index) * 24 * 60 * 60 * 1000).toISOString() : undefined,
    }));

    const demoProjects: Project[] = [
        {
            id: 'proj-1',
            title: 'Portfolio Website',
            description: 'Personal portfolio built with HTML, CSS, and JavaScript',
            techStack: ['HTML', 'CSS', 'JavaScript'],
            completed: true,
            completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'proj-2',
            title: 'Todo App',
            description: 'Task management app with React',
            techStack: ['React', 'TypeScript', 'CSS'],
            completed: false,
        },
    ];

    const demoMockTests: MockTestResult[] = [
        {
            id: 'test-1',
            topic: 'internet',
            category: 'fundamentals',
            score: 70,
            totalQuestions: 5,
            correctAnswers: 3,
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    return {
        userId: 'demo-user',
        profile: {
            name: 'Demo Student',
            email: 'demo@example.com',
            college: 'Demo University',
            role: 'Frontend Developer',
        },
        skills: {
            dsa: 45,
            projects: 30,
            fundamentals: 60,
            softSkills: 55,
        },
        roadmap: {
            topics: demoRoadmap,
            source: 'default',
            lastUpdated: now,
        },
        projects: demoProjects,
        mockTests: demoMockTests,
        metadata: {
            createdAt: now,
            lastActive: now,
            version: '1.0.0',
        },
    };
}

/**
 * Creates an empty user state for new users
 */
export function createEmptyUser(userId: string, profile: { name: string; email: string; college: string; role: string }): UserState {
    const now = new Date().toISOString();

    return {
        userId,
        profile,
        skills: {
            dsa: 0,
            projects: 0,
            fundamentals: 0,
            softSkills: 0,
        },
        roadmap: {
            topics: frontendRoadmap.map(topic => ({ ...topic })),
            source: 'default',
            lastUpdated: now,
        },
        projects: [],
        mockTests: [],
        metadata: {
            createdAt: now,
            lastActive: now,
            version: '1.0.0',
        },
    };
}
