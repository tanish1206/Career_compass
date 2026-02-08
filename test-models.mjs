// Test different Gemini model names
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyDoLtSWMyZ4AvZmeG5Tw6dzDl6vxybspkk';
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'models/gemini-1.5-flash',
    'models/gemini-pro'
];

async function testModel(modelName) {
    try {
        console.log(`\nTesting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent('Say "hello" in JSON format: {"message": "hello"}');
        const response = await result.response;
        const text = response.text();

        console.log(`✅ ${modelName} works! Response:`, text.substring(0, 50));
        return true;
    } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
        return false;
    }
}

async function findWorkingModel() {
    for (const modelName of modelsToTest) {
        const works = await testModel(modelName);
        if (works) {
            console.log(`\n🎉 Found working model: ${modelName}`);
            return modelName;
        }
    }
    console.log('\n❌ No working model found!');
}

findWorkingModel();
