// AI Integration for Career Compass
// Groq AI client and roadmap generation logic

import Groq from 'groq-sdk';
import { RoadmapNode } from './data';

// Initialize Groq AI
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

// System prompt for roadmap generation
const ROADMAP_GENERATION_PROMPT = `You are a placement preparation roadmap generator for Indian college students targeting tier-2/3 colleges.

STRICT OUTPUT RULES:
- Return ONLY valid JSON, no markdown, no code blocks
- Use EXACT schema: {"roadmap": RoadmapNode[]}
- Each node must have: id (lowercase_underscore), title, description, completed (always false), position {x: 50, y: number}, prerequisites (array of ids or empty)
- Maximum 14 topics total
- IDs must be unique and descriptive
- Prerequisites must reference existing topic IDs only
- Position.y should increment by 15 for each topic (start at 10)

CONTENT RULES:
- Focus ONLY on placement-relevant skills
- Prioritize weak areas from user profile
- Include: DSA, Core CS (OS, DBMS, Networks), System Design basics, Projects
- Keep descriptions concise (max 60 chars)
- No motivational text, only actionable topics
- Realistic timeline based on hours/day

EXAMPLE OUTPUT:
{
  "roadmap": [
    {
      "id": "arrays_strings",
      "title": "Arrays & Strings",
      "description": "Basic DSA patterns, two pointers, sliding window",
      "completed": false,
      "position": {"x": 50, "y": 10},
      "prerequisites": []
    }
  ]
}`;

// System prompt for roadmap editing
const ROADMAP_EDIT_PROMPT = `You are a roadmap editor. Modify the existing roadmap based on user commands.

STRICT OUTPUT RULES:
- Return ONLY valid JSON: {"roadmap": RoadmapNode[], "explanation": string}
- Maintain same schema as input
- Keep completed status unchanged (unless user asks to mark as done)
- Update prerequisites of other nodes if a prerequisite node is removed
- Explanation max 50 chars

CRITICAL INSTRUCTIONS FOR REMOVAL:
- If user asks to "remove", "delete", "skip", or "drop" a topic:
  1. COMPLETELY REMOVE the node from the "roadmap" array. DO NOT just mark as completed.
  2. Remove the deleted node's ID from any "prerequisites" arrays in other nodes.
  3. Adjust "position" of remaining nodes to close gaps.

ALLOWED MODIFICATIONS:
- Remove topics user already knows (HARD DELETE)
- Adjust pace (reduce/increase topics)
- Reorder priorities
- Add missing critical topics
- Simplify or expand depth

FORBIDDEN:
- Don't add motivational text
- Don't change topic IDs arbitrarily
- Don't leave "ghost" nodes (remove them entirely)`;

// Validate roadmap structure
function validateRoadmap(data: any): data is { roadmap: RoadmapNode[] } {
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.roadmap)) return false;

    return data.roadmap.every((node: any) =>
        typeof node.id === 'string' &&
        typeof node.title === 'string' &&
        typeof node.description === 'string' &&
        typeof node.completed === 'boolean' &&
        typeof node.position === 'object' &&
        typeof node.position.x === 'number' &&
        typeof node.position.y === 'number' &&
        (!node.prerequisites || Array.isArray(node.prerequisites))
    );
}

// Generate personalized roadmap
export async function generatePersonalizedRoadmap(profile: {
    role: string;
    currentSkills: {
        dsa: number;
        coreCS: number;
        frameworks: number;
    };
    hoursPerDay: number;
    timelineWeeks: number;
}): Promise<RoadmapNode[]> {
    try {
        console.log('🤖 Starting AI roadmap generation with profile:', profile);
        console.log('🔑 API Key exists:', !!process.env.GROQ_API_KEY);

        const userPrompt = `Generate a personalized placement preparation roadmap:

Role: ${profile.role}
Current Skills:
- DSA: ${profile.currentSkills.dsa}/100
- Core CS (OS, DBMS, Networks): ${profile.currentSkills.coreCS}/100
- Frameworks: ${profile.currentSkills.frameworks}/100

Available Time: ${profile.hoursPerDay} hours/day
Timeline: ${profile.timelineWeeks} weeks

Prioritize weak areas. Generate realistic roadmap.`;

        console.log('📤 Sending request to Groq AI...');
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: ROADMAP_GENERATION_PROMPT
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2000,
        });

        const text = chatCompletion.choices[0]?.message?.content || "";
        console.log('📥 Received AI response:', text.substring(0, 200) + '...');

        // Clean response (remove markdown if present)
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const data = JSON.parse(cleanText);
        console.log('✅ Parsed JSON successfully, roadmap nodes:', data.roadmap?.length);

        if (!validateRoadmap(data)) {
            throw new Error('Invalid roadmap structure from AI');
        }

        console.log('✅ Validation passed, returning roadmap');
        return data.roadmap;
    } catch (error) {
        console.error('❌ AI roadmap generation failed:', error);
        throw error;
    }
}

// Edit roadmap via chatbot
export async function editRoadmapWithAI(
    currentRoadmap: RoadmapNode[],
    userMessage: string
): Promise<{ roadmap: RoadmapNode[]; explanation: string }> {
    try {
        console.log('💬 Chatbot edit request:', userMessage);
        console.log('📋 Current roadmap nodes:', currentRoadmap.length);

        // Validate API key exists
        if (!process.env.GROQ_API_KEY) {
            console.error('❌ GROQ_API_KEY not found in environment');
            throw new Error('AI service not configured. Please add GROQ_API_KEY to .env.local');
        }

        console.log('🔑 API Key exists:', !!process.env.GROQ_API_KEY);
        console.log('🔑 API Key length:', process.env.GROQ_API_KEY.length);

        const userPrompt = `Current Roadmap:
${JSON.stringify(currentRoadmap, null, 2)}

User Request: "${userMessage}"

Modify the roadmap accordingly. Return JSON with updated roadmap and brief explanation.`;

        console.log('📤 Sending edit request to Groq AI...');

        let chatCompletion;
        try {
            chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: ROADMAP_EDIT_PROMPT
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.5,
                max_tokens: 2000,
            });
        } catch (apiError: any) {
            console.error('❌ Groq API call failed:', apiError);
            if (apiError.message?.includes('API key')) {
                throw new Error('Invalid API key. Please check your GROQ_API_KEY in .env.local');
            }
            if (apiError.message?.includes('quota')) {
                throw new Error('API quota exceeded. Please check your Groq console.');
            }
            throw new Error(`Groq API error: ${apiError.message || 'Unknown error'}`);
        }

        const text = chatCompletion.choices[0]?.message?.content || "";
        console.log('📥 Received edit response:', text.substring(0, 200) + '...');

        // Clean response
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let data;
        try {
            data = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('❌ Failed to parse AI response:', cleanText);
            throw new Error('AI returned invalid JSON. Please try rephrasing your request.');
        }

        if (!validateRoadmap(data)) {
            console.error('❌ Invalid roadmap structure:', data);
            throw new Error('AI returned invalid roadmap structure. Please try again.');
        }

        if (!('explanation' in data) || typeof data.explanation !== 'string') {
            console.error('❌ Missing explanation in response');
            throw new Error('AI response missing explanation. Please try again.');
        }

        console.log('✅ Edit successful:', data.explanation);
        return {
            roadmap: data.roadmap,
            explanation: data.explanation
        };
    } catch (error: any) {
        console.error('❌ AI roadmap edit failed:', error);
        console.error('❌ Error type:', error.constructor.name);
        console.error('❌ Error message:', error.message);
        throw error;
    }
}
