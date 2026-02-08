// Test Gemini API with v1 endpoint (not v1beta)
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AlzaSyBEmHJwWQeQ-XtlOHQCIOkj2aPWi6ZICP8';

async function testGeminiAPI() {
    console.log('🧪 Testing Gemini API with different models...\n');

    const models = ['gemini-pro', 'gemini-1.0-pro', 'text-bison-001'];

    for (const modelName of models) {
        try {
            console.log(`\n📝 Testing model: ${modelName}`);
            console.log('─'.repeat(50));

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent('Say "Hello"');
            const response = await result.response;
            const text = response.text();

            console.log('✅ SUCCESS!');
            console.log('Response:', text.substring(0, 100));
            console.log(`\n🎉 Model "${modelName}" WORKS!\n`);

            return { success: true, model: modelName };

        } catch (error) {
            console.log('❌ Failed:', error.message.substring(0, 100));
        }
    }

    console.log('\n❌ None of the models worked.');
    console.log('\n💡 Solution: The API key might be restricted or invalid.');
    console.log('   Get a new key from: https://aistudio.google.com/app/apikey');

    return { success: false };
}

testGeminiAPI().then(result => {
    if (result.success) {
        console.log(`\n✅ Use model "${result.model}" in your lib/ai.ts file!`);
    }
    process.exit(result.success ? 0 : 1);
});
