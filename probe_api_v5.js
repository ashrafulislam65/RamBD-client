const axios = require('axios');

const domains = [
    "https://admin.unicodeconverter.info",
    "https://admin.felnatech.com"
];

const variations = [
    '/api/cus-login',
    '/api/cus-log-in',
    '/api/cuslogin',
    '/api/customer/login',
    '/api/customer-login',
    '/api/auth/login',
    '/api/login',
    '/api/user/login',
    '/api/cus-authenticate',
    '/api/cus/login',
    '/api/customer/authenticate',
    '/api/cus-verifyphone',
    '/api/cus-password-login'
];

async function probe() {
    for (const domain of domains) {
        console.log(`\n--- Probing domain: ${domain} ---`);
        for (const ep of variations) {
            try {
                const response = await axios.post(`${domain}${ep}`, {
                    phone: "01958666967",
                    mobile: "01958666967",
                    password: "test"
                }, { timeout: 5000 });
                console.log(`✅ ${ep}: ${response.status}`);
            } catch (error) {
                if (error.response) {
                    if (error.response.status !== 404) {
                        console.log(`❓ ${ep}: ${error.response.status}`);
                        if (error.response.data) {
                            console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 100)}`);
                        }
                    }
                }
            }
        }
    }
}

probe();
