// Storage abstraction layer for Career Compass
// Centralizes all localStorage operations for easy migration to Supabase
// TODO: Replace localStorage with Supabase client calls

import type { UserProfile, RoadmapNode } from './types';
import { defaultUserProfile } from './mockData';

// Storage keys
const STORAGE_KEYS = {
    USER_PROFILE: 'userProfile',
    ROADMAP_PROGRESS: 'roadmapProgress',
    TEST_SCORES: 'testScores',
} as const;

// ============================================
// User Profile Storage
// ============================================

/**
 * Get user profile from localStorage
 * TODO: Replace with Supabase query: supabase.from('profiles').select('*').single()
 */
export function getUserProfile(): UserProfile {
    if (typeof window === 'undefined') return defaultUserProfile;

    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!stored) return defaultUserProfile;

    try {
        const data = JSON.parse(stored);
        return { ...defaultUserProfile, ...data };
    } catch (error) {
        console.error('Error parsing user profile:', error);
        return defaultUserProfile;
    }
}

/**
 * Save user profile to localStorage
 * TODO: Replace with Supabase upsert: supabase.from('profiles').upsert(profile)
 */
export function saveUserProfile(profile: Partial<UserProfile>): void {
    if (typeof window === 'undefined') return;

    const current = getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
}

/**
 * Clear user profile from localStorage
 * TODO: Replace with Supabase delete: supabase.from('profiles').delete()
 */
export function clearUserProfile(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}

// ============================================
// Roadmap Progress Storage
// ============================================

/**
 * Get roadmap progress from localStorage
 * TODO: Replace with Supabase query: supabase.from('roadmap_progress').select('*')
 */
export function getRoadmapProgress(): RoadmapNode[] | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(STORAGE_KEYS.ROADMAP_PROGRESS);
    if (!stored) return null;

    try {
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error parsing roadmap progress:', error);
        return null;
    }
}

/**
 * Save roadmap progress to localStorage
 * TODO: Replace with Supabase upsert: supabase.from('roadmap_progress').upsert(progress)
 */
export function saveRoadmapProgress(progress: RoadmapNode[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ROADMAP_PROGRESS, JSON.stringify(progress));
}

/**
 * Clear roadmap progress from localStorage
 * TODO: Replace with Supabase delete: supabase.from('roadmap_progress').delete()
 */
export function clearRoadmapProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ROADMAP_PROGRESS);
}

// ============================================
// Test Scores Storage
// ============================================

export interface TestScore {
    topic: string;
    score: number;
    date: string;
    passed: boolean;
}

/**
 * Get all test scores from localStorage
 * TODO: Replace with Supabase query: supabase.from('test_scores').select('*')
 */
export function getTestScores(): TestScore[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEYS.TEST_SCORES);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error parsing test scores:', error);
        return [];
    }
}

/**
 * Save a test score to localStorage
 * TODO: Replace with Supabase insert: supabase.from('test_scores').insert(score)
 */
export function saveTestScore(score: TestScore): void {
    if (typeof window === 'undefined') return;

    const scores = getTestScores();
    scores.push(score);
    localStorage.setItem(STORAGE_KEYS.TEST_SCORES, JSON.stringify(scores));
}

/**
 * Clear all test scores from localStorage
 * TODO: Replace with Supabase delete: supabase.from('test_scores').delete()
 */
export function clearTestScores(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.TEST_SCORES);
}

// ============================================
// Utility Functions
// ============================================

/**
 * Clear all app data from localStorage
 * Useful for logout or reset functionality
 * TODO: Replace with Supabase multi-table delete
 */
export function clearAllData(): void {
    clearUserProfile();
    clearRoadmapProgress();
    clearTestScores();
}

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
    const profile = getUserProfile();
    return profile.name !== 'Student'; // Default name means not onboarded
}
