const axios = require('axios');

const apiBaseUrl = "https://admin.unicodeconverter.info";
const endpoints = [
    '/api/cus-login',
    '/api/login',
    '/api/cus-register',
    '/api/cus-verifyphone/01958666967'
];

async function probe() {
    for (const ep of endpoints) {
        try {
            console.log(`Probing ${apiBaseUrl}${ep}...`);
            const response = await axios.post(`${apiBaseUrl}${ep}`, {
                phone: "01958666967",
                password: "test"
            }, { timeout: 10000 });
            console.log(`✅ ${ep}: ${response.status} ${JSON.stringify(response.data).substring(0, 100)}`);
        } catch (error) {
            console.log(`❌ ${ep}: ${error.response?.status || error.message}`);
            if (error.response?.data) {
                console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 100)}`);
            }
        }
    }
}

probe();
