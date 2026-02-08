// Test Groq API
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: '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'
});

async function testGroq() {
    console.log('🧪 Testing Groq API...\n');

    try {
        console.log('1️⃣  Sending test request...');
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: "Say 'Hello' in JSON format: {\"message\": \"Hello\"}"
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 100,
        });

        console.log('   ✅ Request sent\n');

        const response = chatCompletion.choices[0]?.message?.content || "";

        console.log('📥 Groq Response:');
        console.log('─'.repeat(50));
        console.log(response);
        console.log('─'.repeat(50));
        console.log('\n✅ SUCCESS! Groq API is working!\n');

        return true;

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('\n📋 Error Details:');
        console.error('   Type:', error.constructor.name);

        if (error.message?.includes('API key')) {
            console.error('\n💡 Solution: Your API key is invalid');
            console.error('   Get a new one from: https://console.groq.com/keys');
        } else if (error.message?.includes('quota')) {
            console.error('\n💡 Solution: API quota exceeded');
            console.error('   Check your usage at: https://console.groq.com/');
        } else {
            console.error('\n💡 Full error:', error);
        }

        return false;
    }
}

testGroq().then(success => {
    process.exit(success ? 0 : 1);
});
