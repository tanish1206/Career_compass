// Test Groq API Edit functionality
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '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'
});

const initialRoadmap = [
    {
        "id": "html_basics",
        "title": "HTML Basics",
        "description": "Structure, semantic tags, forms",
        "completed": false,
        "position": { "x": 50, "y": 10 },
        "prerequisites": []
    },
    {
        "id": "css_basics",
        "title": "CSS Basics",
        "description": "Selectors, box model, flexbox",
        "completed": false,
        "position": { "x": 50, "y": 25 },
        "prerequisites": ["html_basics"]
    },
    {
        "id": "js_basics",
        "title": "JavaScript Basics",
        "description": "Variables, functions, DOM",
        "completed": false,
        "position": { "x": 50, "y": 40 },
        "prerequisites": ["html_basics", "css_basics"]
    }
];

// System prompt from lib/ai.ts
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

async function testGroqEdit() {
    console.log('🧪 Testing Groq API Edit - Removing HTML...\n');

    const userMessage = "Remove HTML, I already know it";

    const userPrompt = `Current Roadmap:
${JSON.stringify(initialRoadmap, null, 2)}

User Request: "${userMessage}"

Modify the roadmap accordingly. Return JSON with updated roadmap and brief explanation.`;

    try {
        console.log('1️⃣  Sending edit request...');
        const chatCompletion = await groq.chat.completions.create({
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

        const responseText = chatCompletion.choices[0]?.message?.content || "";
        const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const data = JSON.parse(cleanText);

        console.log('📥 Groq Response Explanation:', data.explanation);
        console.log('📋 Initial Node Count:', initialRoadmap.length);
        console.log('📋 New Node Count:', data.roadmap.length);

        const htmlNode = data.roadmap.find((n) => n.id === 'html_basics');
        if (!htmlNode) {
            console.log('✅ SUCCESS! "html_basics" node was removed.');
        } else {
            console.error('❌ FAILURE! "html_basics" node still exists.');
        }

        const cssNode = data.roadmap.find((n) => n.id === 'css_basics');
        if (cssNode && !cssNode.prerequisites.includes('html_basics')) {
            console.log('✅ SUCCESS! "html_basics" removed from CSS prerequisites.');
        } else {
            console.log('ℹ️ CSS Node Prereqs:', cssNode?.prerequisites);
        }

        return !htmlNode;

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        return false;
    }
}

testGroqEdit().then(success => {
    process.exit(success ? 0 : 1);
});
