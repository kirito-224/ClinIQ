const fetch = require('node-fetch');

async function testTriage() {
    console.log('Testing Triage API...');
    try {
        const response = await fetch('http://localhost:5000/api/triage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                symptoms: 'Mild headache',
                duration: '2 hours',
                severity: 3,
                age: 25
            })
        });

        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testTriage();
