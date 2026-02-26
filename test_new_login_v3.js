const axios = require('axios');

async function testLogin() {
    const url = 'https://admin.unicodeconverter.info/api/customer-login-page';
    const payload = {
        email: '01958666966',
        password: 'test'
    };

    console.log(`Testing POST to: ${url}`);
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

testLogin();
