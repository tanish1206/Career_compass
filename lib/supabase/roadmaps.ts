// Roadmap management functions (AI-ready)
import { supabase } from './client';
import { RoadmapNode } from '../data';

export interface RoadmapData {
    id: string;
    user_id: string;
    domain: string;
    generated_by: 'system' | 'ai';
    created_at: string;
    items: RoadmapNode[];
}

/**
 * Save a roadmap to Supabase
 * @param userId - User ID
 * @param roadmap - Array of roadmap nodes
 * @param generatedBy - 'system' or 'ai' (AI-ready parameter)
 * @param domain - Target domain (e.g., "Frontend Developer")
 */
export async function saveRoadmap(
    userId: string,
    roadmap: RoadmapNode[],
    generatedBy: 'system' | 'ai' = 'system',
    domain: string = 'Frontend Developer'
): Promise<RoadmapData | null> {
    try {
        // 1. Create roadmap entry
        const { data: roadmapData, error: roadmapError } = await supabase
            .from('roadmaps')
            .insert({
                user_id: userId,
                domain,
                generated_by: generatedBy,
            })
            .select()
            .single();

        if (roadmapError) throw roadmapError;

        // 2. Create roadmap items
        const items = roadmap.map((node) => ({
            roadmap_id: roadmapData.id,
            topic_id: node.id,
            title: node.title,
            description: node.description,
            position_x: node.position.x,
            position_y: node.position.y,
            prerequisites: node.prerequisites || [],
            status: node.completed ? 'completed' : 'not_started',
        }));

        const { error: itemsError } = await supabase
            .from('roadmap_items')
            .insert(items);

        if (itemsError) throw itemsError;

        return {
            ...roadmapData,
            items: roadmap,
        };
    } catch (error) {
        console.error('Failed to save roadmap:', error);
        return null;
    }
}

/**
 * Get user's active roadmap
 * Returns the most recent roadmap with all items
 */
export async function getRoadmap(userId: string): Promise<RoadmapNode[] | null> {
    try {
        // 1. Get most recent roadmap
        const { data: roadmapData, error: roadmapError } = await supabase
            .from('roadmaps')
            .select('id')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (roadmapError) throw roadmapError;
        if (!roadmapData) return null;

        // 2. Get all roadmap items
        const { data: items, error: itemsError } = await supabase
            .from('roadmap_items')
            .select('*')
            .eq('roadmap_id', roadmapData.id)
            .order('position_y', { ascending: true });

        if (itemsError) throw itemsError;
        if (!items) return null;

        // 3. Convert to RoadmapNode format
        const roadmap: RoadmapNode[] = items.map((item) => ({
            id: item.topic_id,
            title: item.title,
            description: item.description || '',
            completed: item.status === 'completed',
            position: {
                x: item.position_x,
                y: item.position_y,
            },
            prerequisites: item.prerequisites || undefined,
        }));

        return roadmap;
    } catch (error) {
        console.warn('Failed to fetch roadmap from Supabase:', error);
        return null;
    }
}

/**
 * Update a single roadmap item
 * Used by AI chatbot for incremental edits
 */
export async function updateRoadmapItem(
    roadmapId: string,
    topicId: string,
    updates: {
        title?: string;
        description?: string;
        status?: 'not_started' | 'in_progress' | 'completed';
        prerequisites?: string[];
    }
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('roadmap_items')
            .update(updates)
            .eq('roadmap_id', roadmapId)
            .eq('topic_id', topicId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Failed to update roadmap item:', error);
        return false;
    }
}

/**
 * Delete a roadmap and all its items
 */
export async function deleteRoadmap(roadmapId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('roadmaps')
            .delete()
            .eq('id', roadmapId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Failed to delete roadmap:', error);
        return false;
    }
}
