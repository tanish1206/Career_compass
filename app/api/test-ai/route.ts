import { NextRequest, NextResponse } from 'next/server';
import { editRoadmapWithAI } from '@/lib/ai';
import { RoadmapNode } from '@/lib/data';

// Simple test roadmap


const TEST_ROADMAP: RoadmapNode[] = [
    {
        id: 'html',
        title: 'HTML Basics',
        description: 'Learn the structure of web pages',
        category: 'fundamentals',   // ✅ MUST be one of allowed values
        difficulty: 'easy',         // ✅ MUST be 'easy' | 'medium' | 'hard'
        completed: false,
        position: { x: 100, y: 200 },
        prerequisites: [],
    },
];


export async function GET(request: NextRequest) {
    try {
        console.log('🧪 Testing AI chatbot...');

        // Test 1: Check API key
        const hasApiKey = !!process.env.GEMINI_API_KEY;
        const apiKeyLength = process.env.GEMINI_API_KEY?.length || 0;

        if (!hasApiKey) {
            return NextResponse.json({
                success: false,
                error: 'GEMINI_API_KEY not found in environment',
                solution: 'Add GEMINI_API_KEY to .env.local and restart server'
            }, { status: 500 });
        }

        // Test 2: Try AI edit
        console.log('🧪 Testing AI edit with simple request...');
        const result = await editRoadmapWithAI(TEST_ROADMAP, 'Change the title to "Updated Topic"');

        return NextResponse.json({
            success: true,
            hasApiKey,
            apiKeyLength,
            apiKeyPreview: process.env.GEMINI_API_KEY?.substring(0, 10) + '...',
            aiTest: {
                success: true,
                explanation: result.explanation,
                roadmapUpdated: result.roadmap.length > 0
            },
            message: '✅ AI chatbot is working correctly!'
        });

    } catch (error: any) {
        console.error('🧪 Test failed:', error);

        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error',
            errorType: error.constructor.name,
            hasApiKey: !!process.env.GEMINI_API_KEY,
            apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
            solution: getSolution(error.message)
        }, { status: 500 });
    }
}

function getSolution(errorMessage: string): string {
    if (errorMessage?.includes('API key')) {
        return 'Get a new API key from https://aistudio.google.com/app/apikey';
    }
    if (errorMessage?.includes('quota')) {
        return 'Check your API quota at https://aistudio.google.com/';
    }
    if (errorMessage?.includes('not configured')) {
        return 'Add GEMINI_API_KEY to .env.local and restart server';
    }
    if (errorMessage?.includes('model')) {
        return 'The model name might be incorrect. Try "gemini-pro" or "gemini-1.5-flash"';
    }
    return 'Check server logs for more details';
}
