// Progress tracking functions (AI-ready)
import { supabase } from './client';

export interface ProgressData {
    id: string;
    user_id: string;
    topic_id: string;
    completion_percent: number;
    verified: boolean;
    last_updated: string;
}

/**
 * Get all progress for a user
 * Returns a map of topic_id -> completion_percent
 */
export async function getProgress(userId: string): Promise<Record<string, number> | null> {
    try {
        const { data, error } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        if (!data) return null;

        // Convert to map for easy lookup
        const progressMap: Record<string, number> = {};
        data.forEach((item) => {
            progressMap[item.topic_id] = item.completion_percent;
        });

        return progressMap;
    } catch (error) {
        console.warn('Failed to fetch progress from Supabase:', error);
        return null;
    }
}

/**
 * Update progress for a specific topic
 * Creates new entry if doesn't exist (upsert)
 */
export async function updateProgress(
    userId: string,
    topicId: string,
    completionPercent: number
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('progress')
            .upsert(
                {
                    user_id: userId,
                    topic_id: topicId,
                    completion_percent: completionPercent,
                    last_updated: new Date().toISOString(),
                },
                {
                    onConflict: 'user_id,topic_id',
                }
            );

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Failed to update progress:', error);
        return false;
    }
}

/**
 * Mark progress as AI-verified
 * Future feature for AI-assisted progress verification
 */
export async function verifyProgress(
    userId: string,
    topicId: string
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('progress')
            .update({ verified: true })
            .eq('user_id', userId)
            .eq('topic_id', topicId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Failed to verify progress:', error);
        return false;
    }
}

/**
 * Get progress for a specific topic
 */
export async function getTopicProgress(
    userId: string,
    topicId: string
): Promise<ProgressData | null> {
    try {
        const { data, error } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', userId)
            .eq('topic_id', topicId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.warn('Failed to fetch topic progress:', error);
        return null;
    }
}
