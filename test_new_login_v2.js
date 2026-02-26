const axios = require('axios');

async function testLogin() {
    const url = 'https://admin.felnatech.com/api/customer-login-page';

    const payloads = [
        {
            email: '01958666966',
            password: 'test'
        },
        {
            email: '+8801958666966',
            password: 'test'
        },
        {
            phone: '01958666966',
            email: '01958666966@rambd.com', // Dummy email if it checks format
            password: 'test'
        }
    ];

    for (const payload of payloads) {
        console.log(`\nTesting POST to: ${url} with payload: ${JSON.stringify(payload)}`);
        try {
            const response = await axios.post(url, payload, { timeout: 10000 });
            console.log('✅ Success Status:', response.status);
            console.log('✅ Success Data:', JSON.stringify(response.data, null, 2));
        } catch (error) {
            if (error.response) {
                console.log('❌ Error Status:', error.response.status);
                console.log('❌ Error Data:', JSON.stringify(error.response.data, null, 2));
            } else {
                console.log('❌ Error:', error.message);
            }
        }
    }
}

testLogin();
