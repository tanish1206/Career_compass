// Test with v1 API and list available models
import * as fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

console.log('Testing Gemini API v1...\n');

// First, list available models
async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Available models:');
            data.models?.forEach(model => {
                console.log(`  - ${model.name}`);
            });
            return data.models;
        } else {
            console.error('❌ Failed to list models:', data);
            return null;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

// Test with v1 API
async function testV1API() {
    console.log('\n📡 Testing v1 API with gemini-pro...');
    try {
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Say hello'
                    }]
                }]
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ v1 API works!');
            console.log('Response:', data.candidates[0].content.parts[0].text);
            return true;
        } else {
            console.error('❌ v1 API failed:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

async function run() {
    await listModels();
    await testV1API();
}

run();
