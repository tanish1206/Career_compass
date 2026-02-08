// Direct Gemini API test
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyDoLtSWMyZ4AvZmeG5Tw6dzDl6vxybspkk';
const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
    try {
        console.log('Testing Gemini API directly...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = 'Generate a JSON object with a single field "test" containing the value "success". Return ONLY the JSON, no markdown.';

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Raw response:', text);

        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        console.log('Cleaned response:', cleanText);

        const data = JSON.parse(cleanText);
        console.log('Parsed data:', data);

        if (data.test === 'success') {
            console.log('✅ Gemini API is working correctly!');
        }
    } catch (error) {
        console.error('❌ Gemini API test failed:', error.message);
        console.error('Full error:', error);
    }
}

testGemini();
