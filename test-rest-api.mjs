// Test Gemini using direct REST API instead of SDK
import * as fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

console.log('Testing with REST API...');
console.log('API Key:', apiKey.substring(0, 20) + '...');

async function testRestAPI() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Say hello in one word'
                    }]
                }]
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS! REST API works!');
            console.log('Response:', JSON.stringify(data, null, 2));
            return true;
        } else {
            console.error('❌ FAILED!');
            console.error('Error:', JSON.stringify(data, null, 2));
            return false;
        }
    } catch (error) {
        console.error('❌ Request failed:', error.message);
        return false;
    }
}

testRestAPI();
