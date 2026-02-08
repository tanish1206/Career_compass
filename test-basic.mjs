// Basic Gemini test from official docs
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDoLtSWMyZ4AvZmeG5Tw6dzDl6vxybspkk';

async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Write a short poem about coding";

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('✅ Success!');
        console.log(text);
    } catch (error) {
        console.error('❌ Error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.response) {
            console.error('Error response:', error.response);
        }
        if (error.status) {
            console.error('Error status:', error.status);
        }
    }
}

run();
