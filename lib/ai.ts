// AI Integration for Career Compass
// Gemini AI client and roadmap generation logic

import { GoogleGenerativeAI } from '@google/generative-ai';
import { RoadmapNode } from './data';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
- Keep completed status unchanged
- Update prerequisites if removing topics
- Explanation max 50 chars

ALLOWED MODIFICATIONS:
- Remove topics user already knows
- Adjust pace (reduce/increase topics)
- Reorder priorities
- Add missing critical topics
- Simplify or expand depth

FORBIDDEN:
- Don't add motivational text
- Don't change topic IDs arbitrarily
- Don't break prerequisite chains`;

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
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const userPrompt = `Generate a personalized placement preparation roadmap:

Role: ${profile.role}
Current Skills:
- DSA: ${profile.currentSkills.dsa}/100
- Core CS (OS, DBMS, Networks): ${profile.currentSkills.coreCS}/100
- Frameworks: ${profile.currentSkills.frameworks}/100

Available Time: ${profile.hoursPerDay} hours/day
Timeline: ${profile.timelineWeeks} weeks

Prioritize weak areas. Generate realistic roadmap.`;

        const result = await model.generateContent([
            ROADMAP_GENERATION_PROMPT,
            userPrompt
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean response (remove markdown if present)
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const data = JSON.parse(cleanText);

        if (!validateRoadmap(data)) {
            throw new Error('Invalid roadmap structure from AI');
        }

        return data.roadmap;
    } catch (error) {
        console.error('AI roadmap generation failed:', error);
        throw error;
    }
}

// Edit roadmap via chatbot
export async function editRoadmapWithAI(
    currentRoadmap: RoadmapNode[],
    userMessage: string
): Promise<{ roadmap: RoadmapNode[]; explanation: string }> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const userPrompt = `Current Roadmap:
${JSON.stringify(currentRoadmap, null, 2)}

User Request: "${userMessage}"

Modify the roadmap accordingly. Return JSON with updated roadmap and brief explanation.`;

        const result = await model.generateContent([
            ROADMAP_EDIT_PROMPT,
            userPrompt
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean response
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const data = JSON.parse(cleanText);

        if (!validateRoadmap(data)) {
            throw new Error('Invalid edit response from AI');
        }

        if (!('explanation' in data) || typeof data.explanation !== 'string') {
            throw new Error('Missing explanation in AI response');
        }

        return {
            roadmap: data.roadmap,
            explanation: data.explanation
        };
    } catch (error) {
        console.error('AI roadmap edit failed:', error);
        throw error;
    }
}
