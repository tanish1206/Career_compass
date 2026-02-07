// API layer for Career Compass
// Placeholder functions for future Supabase integration
// TODO: Implement actual Supabase client calls

import type {
    UserProfile,
    RoadmapNode,
    TestQuestion,
    Resource,
    PlacementOpening,
    NewsItem,
} from './types';
import type { TestScore } from './storage';

// ============================================
// User Profile API
// ============================================

/**
 * Fetch user profile from database
 * TODO: Implement with Supabase
 * @example
 * const { data, error } = await supabase
 *   .from('profiles')
 *   .select('*')
 *   .eq('user_id', userId)
 *   .single();
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using localStorage for MVP');
}

/**
 * Update user profile in database
 * TODO: Implement with Supabase
 * @example
 * const { error } = await supabase
 *   .from('profiles')
 *   .upsert({ user_id: userId, ...profile });
 */
export async function updateUserProfile(
    userId: string,
    profile: Partial<UserProfile>
): Promise<void> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using localStorage for MVP');
}

// ============================================
// Roadmap API
// ============================================

/**
 * Fetch user's roadmap progress from database
 * TODO: Implement with Supabase
 * @example
 * const { data, error } = await supabase
 *   .from('roadmap_progress')
 *   .select('*')
 *   .eq('user_id', userId);
 */
export async function fetchRoadmapProgress(userId: string): Promise<RoadmapNode[]> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using localStorage for MVP');
}

/**
 * Update roadmap progress in database
 * TODO: Implement with Supabase
 * @example
 * const { error } = await supabase
 *   .from('roadmap_progress')
 *   .upsert(progress.map(node => ({ user_id: userId, ...node })));
 */
export async function updateRoadmapProgress(
    userId: string,
    progress: RoadmapNode[]
): Promise<void> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using localStorage for MVP');
}

// ============================================
// Test Scores API
// ============================================

/**
 * Fetch user's test scores from database
 * TODO: Implement with Supabase
 * @example
 * const { data, error } = await supabase
 *   .from('test_scores')
 *   .select('*')
 *   .eq('user_id', userId)
 *   .order('date', { ascending: false });
 */
export async function fetchTestScores(userId: string): Promise<TestScore[]> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using localStorage for MVP');
}

/**
 * Save a test score to database
 * TODO: Implement with Supabase
 * @example
 * const { error } = await supabase
 *   .from('test_scores')
 *   .insert({ user_id: userId, ...score });
 */
export async function saveTestScoreToDb(userId: string, score: TestScore): Promise<void> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using localStorage for MVP');
}

// ============================================
// Resources API
// ============================================

/**
 * Fetch all resources from database
 * TODO: Implement with Supabase
 * @example
 * const { data, error } = await supabase
 *   .from('resources')
 *   .select('*')
 *   .order('topic');
 */
export async function fetchResources(): Promise<Resource[]> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using mockData for MVP');
}

// ============================================
// Placement Openings API
// ============================================

/**
 * Fetch placement openings from database
 * TODO: Implement with Supabase
 * @example
 * const { data, error } = await supabase
 *   .from('placement_openings')
 *   .select('*')
 *   .gte('deadline', new Date().toISOString())
 *   .order('deadline');
 */
export async function fetchPlacementOpenings(): Promise<PlacementOpening[]> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using mockData for MVP');
}

// ============================================
// News API
// ============================================

/**
 * Fetch news items from database
 * TODO: Implement with Supabase
 * @example
 * const { data, error } = await supabase
 *   .from('news')
 *   .select('*')
 *   .order('date', { ascending: false })
 *   .limit(10);
 */
export async function fetchNews(): Promise<NewsItem[]> {
    // Placeholder - will be replaced with Supabase call
    throw new Error('Not implemented - using mockData for MVP');
}

// ============================================
// Authentication API
// ============================================

/**
 * Sign up a new user
 * TODO: Implement with Supabase Auth
 * @example
 * const { data, error } = await supabase.auth.signUp({
 *   email,
 *   password,
 * });
 */
export async function signUp(email: string, password: string): Promise<void> {
    // Placeholder - will be replaced with Supabase Auth
    throw new Error('Not implemented - using mock auth for MVP');
}

/**
 * Sign in an existing user
 * TODO: Implement with Supabase Auth
 * @example
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email,
 *   password,
 * });
 */
export async function signIn(email: string, password: string): Promise<void> {
    // Placeholder - will be replaced with Supabase Auth
    throw new Error('Not implemented - using mock auth for MVP');
}

/**
 * Sign out the current user
 * TODO: Implement with Supabase Auth
 * @example
 * const { error } = await supabase.auth.signOut();
 */
export async function signOut(): Promise<void> {
    // Placeholder - will be replaced with Supabase Auth
    throw new Error('Not implemented - using mock auth for MVP');
}
