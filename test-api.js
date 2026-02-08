// Detailed test script to capture full error
async function testGenerateAPI() {
    console.log('\n=== Testing Generate API ===\n');

    try {
        const response = await fetch('http://localhost:3000/api/roadmap/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'Frontend Developer',
                currentSkills: { dsa: 30, coreCS: 40, frameworks: 20 },
                hoursPerDay: 3,
                timelineWeeks: 4
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.details) {
            console.log('\nError Details:', data.details);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

async function testEditAPI() {
    console.log('\n=== Testing Edit API ===\n');

    try {
        const response = await fetch('http://localhost:3000/api/roadmap/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentRoadmap: [
                    {
                        id: 'html',
                        title: 'HTML',
                        description: 'Test',
                        completed: false,
                        position: { x: 50, y: 10 }
                    }
                ],
                userMessage: 'skip html'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.details) {
            console.log('\nError Details:', data.details);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run tests sequentially
testGenerateAPI()
    .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
    .then(() => testEditAPI())
    .catch(console.error);
