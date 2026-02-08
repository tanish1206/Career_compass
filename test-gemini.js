// Quick test script to verify Gemini API key
// Run with: node test-gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Your API key from .env.local
const API_KEY = 'AIzaSyBK-V6eG8_kZDbvC3UU3etbmV8g8kcbcYQ';

async function testGeminiAPI() {
    console.log('🧪 Testing Gemini API...\n');

    try {
        console.log('1️⃣  Initializing Gemini AI...');
        const genAI = new GoogleGenerativeAI(API_KEY);
        console.log('   ✅ Initialized\n');

        console.log('2️⃣  Creating model instance (gemini-1.5-pro)...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        console.log('   ✅ Model created\n');

        console.log('3️⃣  Sending test request...');
        const result = await model.generateContent('Say "Hello" in JSON format: {"message": "Hello"}');
        console.log('   ✅ Request sent\n');

        console.log('4️⃣  Getting response...');
        const response = await result.response;
        const text = response.text();
        console.log('   ✅ Response received\n');

        console.log('📥 AI Response:');
        console.log('─'.repeat(50));
        console.log(text);
        console.log('─'.repeat(50));
        console.log('\n✅ SUCCESS! Your API key is working correctly!\n');

        return true;

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('\n📋 Error Details:');
        console.error('   Type:', error.constructor.name);

        if (error.message?.includes('API key')) {
            console.error('\n💡 Solution: Your API key is invalid');
            console.error('   Get a new one from: https://aistudio.google.com/app/apikey');
        } else if (error.message?.includes('quota')) {
            console.error('\n💡 Solution: API quota exceeded');
            console.error('   Check your quota at: https://aistudio.google.com/');
        } else if (error.message?.includes('model')) {
            console.error('\n💡 Solution: Model not available');
            console.error('   Try: gemini-1.5-flash or gemini-1.5-pro');
        } else {
            console.error('\n💡 Full error:', error);
        }

        return false;
    }
}

// Run the test
testGeminiAPI().then(success => {
    process.exit(success ? 0 : 1);
});
