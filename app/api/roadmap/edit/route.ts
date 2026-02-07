import { NextRequest, NextResponse } from 'next/server';
import { editRoadmapWithAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { currentRoadmap, userMessage } = body;

        // Validate input
        if (!currentRoadmap || !Array.isArray(currentRoadmap)) {
            return NextResponse.json(
                { error: 'Invalid roadmap data' },
                { status: 400 }
            );
        }

        if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Limit message length
        if (userMessage.length > 500) {
            return NextResponse.json(
                { error: 'Message too long (max 500 chars)' },
                { status: 400 }
            );
        }

        // Edit roadmap with AI
        const result = await editRoadmapWithAI(currentRoadmap, userMessage.trim());

        return NextResponse.json(result);

    } catch (error) {
        console.error('Roadmap edit error:', error);

        return NextResponse.json(
            {
                error: 'Failed to edit roadmap',
                message: 'AI unavailable. Please try again later.'
            },
            { status: 500 }
        );
    }
}
