// Supabase client initialization
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type-safe database types (will be auto-generated later)
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    target_domain: string | null;
                    skill_snapshot: any | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    target_domain?: string | null;
                    skill_snapshot?: any | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    target_domain?: string | null;
                    skill_snapshot?: any | null;
                    created_at?: string;
                };
            };
            roadmaps: {
                Row: {
                    id: string;
                    user_id: string;
                    domain: string;
                    generated_by: 'system' | 'ai';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    domain: string;
                    generated_by?: 'system' | 'ai';
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    domain?: string;
                    generated_by?: 'system' | 'ai';
                    created_at?: string;
                };
            };
            roadmap_items: {
                Row: {
                    id: string;
                    roadmap_id: string;
                    topic_id: string;
                    title: string;
                    description: string | null;
                    priority: number;
                    estimated_days: number | null;
                    position_x: number;
                    position_y: number;
                    prerequisites: string[] | null;
                    status: 'not_started' | 'in_progress' | 'completed';
                };
                Insert: {
                    id?: string;
                    roadmap_id: string;
                    topic_id: string;
                    title: string;
                    description?: string | null;
                    priority?: number;
                    estimated_days?: number | null;
                    position_x?: number;
                    position_y: number;
                    prerequisites?: string[] | null;
                    status?: 'not_started' | 'in_progress' | 'completed';
                };
                Update: {
                    id?: string;
                    roadmap_id?: string;
                    topic_id?: string;
                    title?: string;
                    description?: string | null;
                    priority?: number;
                    estimated_days?: number | null;
                    position_x?: number;
                    position_y?: number;
                    prerequisites?: string[] | null;
                    status?: 'not_started' | 'in_progress' | 'completed';
                };
            };
            progress: {
                Row: {
                    id: string;
                    user_id: string;
                    topic_id: string;
                    completion_percent: number;
                    verified: boolean;
                    last_updated: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    topic_id: string;
                    completion_percent?: number;
                    verified?: boolean;
                    last_updated?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    topic_id?: string;
                    completion_percent?: number;
                    verified?: boolean;
                    last_updated?: string;
                };
            };
        };
    };
};
