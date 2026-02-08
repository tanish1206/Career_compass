// Profile management functions
import { supabase } from './client';

export interface UserProfile {
    id: string;
    email: string;
    target_domain: string | null;
    skill_snapshot: {
        dsa: number;
        coreCS: number;
        frameworks: number;
    } | null;
    created_at: string;
}

/**
 * Get user profile by ID
 * Falls back to null if not found (for demo mode)
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.warn('Failed to fetch profile from Supabase:', error);
        return null;
    }
}

/**
 * Create a new user profile
 */
export async function createProfile(
    userId: string,
    email: string,
    targetDomain?: string
): Promise<UserProfile | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                email,
                target_domain: targetDomain || null,
                skill_snapshot: null,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Failed to create profile:', error);
        return null;
    }
}

/**
 * Update user profile and skill snapshot
 * Used when user updates their skills or target domain
 */
export async function updateProfile(
    userId: string,
    updates: {
        target_domain?: string;
        skill_snapshot?: {
            dsa: number;
            coreCS: number;
            frameworks: number;
        };
    }
): Promise<UserProfile | null> {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Failed to update profile:', error);
        return null;
    }
}
