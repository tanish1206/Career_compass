// Test the NEW API key
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';

// Read API key from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

console.log('Testing API key:', apiKey.substring(0, 20) + '...');

const genAI = new GoogleGenerativeAI(apiKey);

async function testNewKey() {
    try {
        console.log('\n🔑 Testing new API key with gemini-pro...');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent('Say hello in one word');
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS! API key works!');
        console.log('Response:', text);
        return true;
    } catch (error) {
        console.error('❌ FAILED! Error:', error.message);
        console.error('Status:', error.status);
        console.error('Error details:', error.errorDetails);
        return false;
    }
}

testNewKey();
