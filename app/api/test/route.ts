import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const hasApiKey = !!process.env.GEMINI_API_KEY;
        const apiKeyLength = process.env.GEMINI_API_KEY?.length || 0;

        return NextResponse.json({
            status: 'ok',
            hasApiKey,
            apiKeyLength,
            message: hasApiKey
                ? `API key loaded (${apiKeyLength} chars)`
                : 'API key not found in environment'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            error: String(error)
        }, { status: 500 });
    }
}
