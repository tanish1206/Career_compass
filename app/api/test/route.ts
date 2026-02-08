import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
    try {
        const hasApiKey = !!process.env.GEMINI_API_KEY;
        const apiKeyLength = process.env.GEMINI_API_KEY?.length || 0;

        let aiTest = null;

        // Test if API key works with Gemini
        if (hasApiKey) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
                const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
                const result = await model.generateContent('Say "Hello" in JSON format: {"message": "Hello"}');
                const response = await result.response;
                const text = response.text();
                aiTest = {
                    success: true,
                    response: text.substring(0, 100)
                };
            } catch (error: any) {
                aiTest = {
                    success: false,
                    error: error.message
                };
            }
        }

        return NextResponse.json({
            status: 'ok',
            hasApiKey,
            apiKeyLength,
            apiKeyPreview: hasApiKey ? process.env.GEMINI_API_KEY?.substring(0, 10) + '...' : null,
            aiTest,
            message: hasApiKey
                ? `API key loaded (${apiKeyLength} chars)`
                : 'API key not found in environment'
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            error: String(error),
            message: error.message
        }, { status: 500 });
    }
}
