import { NextRequest, NextResponse } from 'next/server';
import { editRoadmapWithAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
    try {
        console.log('📥 Edit API called');
        const body = await request.json();
        console.log('📦 Request body:', { hasRoadmap: !!body.currentRoadmap, message: body.userMessage });

        const { currentRoadmap, userMessage } = body;

        // Validate input
        if (!currentRoadmap || !Array.isArray(currentRoadmap)) {
            console.log('❌ Invalid roadmap data');
            return NextResponse.json(
                { error: 'Invalid roadmap data' },
                { status: 400 }
            );
        }

        if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
            console.log('❌ Invalid message');
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Limit message length
        if (userMessage.length > 500) {
            console.log('❌ Message too long');
            return NextResponse.json(
                { error: 'Message too long (max 500 chars)' },
                { status: 400 }
            );
        }

        console.log('✅ Validation passed, calling AI...');
        // Edit roadmap with AI
        const result = await editRoadmapWithAI(currentRoadmap, userMessage.trim());
        console.log('✅ AI returned result');

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('❌ Roadmap edit error:', error);
        console.error('❌ Error message:', error?.message);
        console.error('❌ Error stack:', error?.stack);

        return NextResponse.json(
            {
                error: 'Failed to edit roadmap',
                message: error?.message || 'AI unavailable. Please try again later.',
                details: process.env.NODE_ENV === 'development' ? error?.message : undefined
            },
            { status: 500 }
        );
    }
}
