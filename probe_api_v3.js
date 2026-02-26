const axios = require('axios');

const domains = [
    "https://admin.unicodeconverter.info",
    "https://admin.felnatech.com"
];

const endpoints = [
    '/api/cus-login',
    '/api/cuslogin',
    '/api/login',
    '/api/customer-login',
    '/api/customer/login',
    '/api/auth/login',
    '/api/cus-authenticate',
    '/api/cus-register',
    '/api/cus-verifyphone/01958666967'
];

async function probe() {
    for (const domain of domains) {
        console.log(`\n--- Probing domain: ${domain} ---`);
        for (const ep of endpoints) {
            try {
                // console.log(`Probing ${domain}${ep}...`);
                const response = await axios.post(`${domain}${ep}`, {
                    phone: "01958666967",
                    password: "test",
                    pincode: "123456"
                }, { timeout: 5000 });
                console.log(`✅ ${ep}: ${response.status} ${JSON.stringify(response.data).substring(0, 100)}`);
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.log(`❓ ${ep}: ${error.response?.status || error.message}`);
                    if (error.response?.data) {
                        console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 100)}`);
                    }
                } else {
                    // console.log(`❌ ${ep}: 404`);
                }
            }
        }
    }
}

probe();
