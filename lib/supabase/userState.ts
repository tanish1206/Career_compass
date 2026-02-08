import { UserState } from '../types/userState';
import { supabase } from './client';

/**
 * Save user state to Supabase
 */
export async function saveUserState(userId: string, state: UserState): Promise<void> {
    const { error } = await supabase
        .from('user_state')
        .upsert({
            user_id: userId,
            state: state,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id'
        });

    if (error) {
        console.error('Error saving user state to Supabase:', error);
        throw error;
    }
}

/**
 * Load user state from Supabase
 */
export async function loadUserState(userId: string): Promise<UserState | null> {
    const { data, error } = await supabase
        .from('user_state')
        .select('state')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned - user doesn't exist yet
            return null;
        }
        console.error('Error loading user state from Supabase:', error);
        throw error;
    }

    return data?.state as UserState || null;
}

/**
 * Delete user state from Supabase
 */
export async function deleteUserState(userId: string): Promise<void> {
    const { error } = await supabase
        .from('user_state')
        .delete()
        .eq('user_id', userId);

    if (error) {
        console.error('Error deleting user state from Supabase:', error);
        throw error;
    }
}
