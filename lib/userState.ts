import {
    UserState,
    DerivedMetrics,
    Skills,
    RoadmapTopic,
    Project,
    MockTestResult,
    SKILL_INCREASE,
    READINESS_WEIGHTS,
} from './types/userState';
import { createDemoUser } from './demoData';
import { saveUserState, loadUserState } from './supabase/userState';

const STORAGE_KEY = 'career_compass_user_state';

/**
 * Get current user state from Supabase (primary) or localStorage (fallback)
 */
export async function getUserState(): Promise<UserState> {
    try {
        // Check if user is in demo mode
        const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';

        if (isDemoMode) {
            // Demo mode: always use demo user
            const localState = loadFromLocalStorage();
            if (localState) {
                return localState;
            }

            // Create demo user if not in localStorage
            const demoUser = createDemoUser();
            saveToLocalStorage(demoUser);
            return demoUser;
        }

        // Real user mode: try Supabase first
        const userId = getCurrentUserId();
        if (userId && userId !== 'demo-user') {
            const supabaseState = await loadUserState(userId);
            if (supabaseState) {
                // Update last active
                supabaseState.metadata.lastActive = new Date().toISOString();
                await saveUserState(userId, supabaseState);
                return supabaseState;
            }
        }

        // Fallback to localStorage for real users
        const localState = loadFromLocalStorage();
        if (localState && !isDemoMode) {
            return localState;
        }

        // If no data exists for real user, create empty state
        // (This should redirect to onboarding in production)
        const emptyState = createEmptyUserState(userId || 'new-user');
        saveToLocalStorage(emptyState);
        return emptyState;
    } catch (error) {
        console.error('Error loading user state:', error);

        // On error, check if demo mode
        const isDemoMode = typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true';
        if (isDemoMode) {
            const demoUser = createDemoUser();
            saveToLocalStorage(demoUser);
            return demoUser;
        }

        // For real users on error, return empty state
        const emptyState = createEmptyUserState('error-user');
        return emptyState;
    }
}

/**
 * Calculate derived metrics from user state
 */
export function getDerivedMetrics(state: UserState): DerivedMetrics {
    // Skills average
    const skillsAverage =
        (state.skills.dsa +
            state.skills.projects +
            state.skills.fundamentals +
            state.skills.softSkills) /
        4;

    // Roadmap progress
    const completedTopicsCount = state.roadmap.topics.filter((t) => t.completed).length;
    const totalTopicsCount = state.roadmap.topics.length;
    const roadmapProgress = totalTopicsCount > 0 ? (completedTopicsCount / totalTopicsCount) * 100 : 0;

    // Projects score (10 points per project, capped at 100)
    const completedProjectsCount = state.projects.filter((p) => p.completed).length;
    const projectsScore = Math.min(completedProjectsCount * 10, 100);

    // Mock test average
    const averageMockTestScore =
        state.mockTests.length > 0
            ? state.mockTests.reduce((sum, test) => sum + test.score, 0) / state.mockTests.length
            : 0;

    // Readiness score (weighted average)
    const readinessScore =
        skillsAverage * READINESS_WEIGHTS.skills +
        roadmapProgress * READINESS_WEIGHTS.roadmap +
        projectsScore * READINESS_WEIGHTS.projects +
        averageMockTestScore * READINESS_WEIGHTS.mockTests;

    // Find weakest and strongest skills
    const skillEntries = Object.entries(state.skills) as [keyof Skills, number][];
    const sortedSkills = skillEntries.sort((a, b) => a[1] - b[1]);

    const weakestSkill = {
        name: formatSkillName(sortedSkills[0][0]),
        value: sortedSkills[0][1],
    };

    const strongestSkill = {
        name: formatSkillName(sortedSkills[sortedSkills.length - 1][0]),
        value: sortedSkills[sortedSkills.length - 1][1],
    };

    return {
        readinessScore: Math.round(readinessScore),
        roadmapProgress: Math.round(roadmapProgress),
        weakestSkill,
        strongestSkill,
        completedTopicsCount,
        totalTopicsCount,
        completedProjectsCount,
        averageMockTestScore: Math.round(averageMockTestScore),
        skillsAverage: Math.round(skillsAverage),
    };
}

/**
 * Update roadmap topic completion status and auto-update related skill
 */
export async function updateRoadmapProgress(
    topicId: string,
    completed: boolean
): Promise<UserState> {
    const state = await getUserState();

    // Find the topic
    const topicIndex = state.roadmap.topics.findIndex((t) => t.id === topicId);
    if (topicIndex === -1) {
        throw new Error(`Topic ${topicId} not found`);
    }

    const topic = state.roadmap.topics[topicIndex];
    const wasCompleted = topic.completed;

    // Update completion status
    state.roadmap.topics[topicIndex] = {
        ...topic,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
    };

    // Auto-update skill if newly completed (not if uncompleting)
    if (completed && !wasCompleted) {
        const skillIncrease = SKILL_INCREASE[topic.difficulty];
        const skillKey = topic.category;

        // Only update if it's a valid skill category
        if (skillKey in state.skills) {
            state.skills[skillKey] = Math.min(state.skills[skillKey] + skillIncrease, 100);
        }
    }

    // Update metadata
    state.roadmap.lastUpdated = new Date().toISOString();
    state.metadata.lastActive = new Date().toISOString();

    // Save to both Supabase and localStorage
    await persistUserState(state);

    return state;
}

/**
 * Record mock test result and average with existing skill
 */
export async function recordMockTestResult(result: {
    topic: string;
    category: 'dsa' | 'fundamentals';
    totalQuestions: number;
    correctAnswers: number;
}): Promise<UserState> {
    const state = await getUserState();

    const score = Math.round((result.correctAnswers / result.totalQuestions) * 100);

    // Add test result to history
    const mockTestResult: MockTestResult = {
        id: `test-${Date.now()}`,
        topic: result.topic,
        category: result.category,
        score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        completedAt: new Date().toISOString(),
    };

    state.mockTests.push(mockTestResult);

    // Average test score with existing skill (never replace)
    const currentSkill = state.skills[result.category];
    state.skills[result.category] = Math.round((currentSkill + score) / 2);

    // Update metadata
    state.metadata.lastActive = new Date().toISOString();

    // Save to both Supabase and localStorage
    await persistUserState(state);

    return state;
}

/**
 * Manually update a skill level
 */
export async function updateSkillLevel(
    skill: keyof Skills,
    value: number
): Promise<UserState> {
    const state = await getUserState();

    // Clamp value between 0 and 100
    state.skills[skill] = Math.max(0, Math.min(100, value));

    // Update metadata
    state.metadata.lastActive = new Date().toISOString();

    // Save to both Supabase and localStorage
    await persistUserState(state);

    return state;
}

/**
 * Add a new project
 */
export async function addProject(
    project: Omit<Project, 'id'>
): Promise<UserState> {
    const state = await getUserState();

    const newProject: Project = {
        id: `proj-${Date.now()}`,
        ...project,
    };

    state.projects.push(newProject);

    // If project is completed, increase projects skill
    if (project.completed) {
        state.skills.projects = Math.min(state.skills.projects + 10, 100);
    }

    // Update metadata
    state.metadata.lastActive = new Date().toISOString();

    // Save to both Supabase and localStorage
    await persistUserState(state);

    return state;
}

/**
 * Update project completion status
 */
export async function updateProjectCompletion(
    projectId: string,
    completed: boolean
): Promise<UserState> {
    const state = await getUserState();

    const projectIndex = state.projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
        throw new Error(`Project ${projectId} not found`);
    }

    const wasCompleted = state.projects[projectIndex].completed;

    state.projects[projectIndex] = {
        ...state.projects[projectIndex],
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
    };

    // Update projects skill
    if (completed && !wasCompleted) {
        state.skills.projects = Math.min(state.skills.projects + 10, 100);
    } else if (!completed && wasCompleted) {
        state.skills.projects = Math.max(state.skills.projects - 10, 0);
    }

    // Update metadata
    state.metadata.lastActive = new Date().toISOString();

    // Save to both Supabase and localStorage
    await persistUserState(state);

    return state;
}

/**
 * Update entire roadmap (for AI-generated roadmaps)
 */
export async function updateEntireRoadmap(
    topics: RoadmapTopic[],
    source: 'default' | 'ai' | 'system'
): Promise<UserState> {
    const state = await getUserState();

    state.roadmap = {
        topics,
        source,
        lastUpdated: new Date().toISOString(),
    };

    // Update metadata
    state.metadata.lastActive = new Date().toISOString();

    // Save to both Supabase and localStorage
    await persistUserState(state);

    return state;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get current user ID (from auth or demo)
 */
function getCurrentUserId(): string {
    // For now, always return demo-user
    // TODO: Integrate with actual auth when implemented
    return 'demo-user';
}

/**
 * Save user state to both Supabase and localStorage
 */
async function persistUserState(state: UserState): Promise<void> {
    // Save to localStorage (always)
    saveToLocalStorage(state);

    // Try to save to Supabase
    try {
        if (state.userId && state.userId !== 'demo-user') {
            await saveUserState(state.userId, state);
        }
    } catch (error) {
        console.warn('Failed to save to Supabase, localStorage backup exists:', error);
    }
}

/**
 * Load user state from localStorage
 */
function loadFromLocalStorage(): UserState | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return null;
}

/**
 * Save user state to localStorage
 */
function saveToLocalStorage(state: UserState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Format skill name for display
 */
function formatSkillName(skill: keyof Skills): string {
    const names: Record<keyof Skills, string> = {
        dsa: 'DSA',
        projects: 'Projects',
        fundamentals: 'CS Fundamentals',
        softSkills: 'Soft Skills',
    };
    return names[skill];
}

/**
 * Create empty user state for new real users
 */
function createEmptyUserState(userId: string): UserState {
    return {
        userId,
        profile: {
            name: 'New User',
            email: '',
            role: 'Full Stack Developer',
            college: '',
        },
        skills: {
            dsa: 0,
            projects: 0,
            fundamentals: 0,
            softSkills: 0,
        },
        roadmap: {
            topics: [],
            source: 'default',
            lastUpdated: new Date().toISOString(),
        },
        projects: [],
        mockTests: [],
        metadata: {
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            version: '1.0',
        },
    };
}
