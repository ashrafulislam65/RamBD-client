const axios = require('axios');

const domain = "https://admin.unicodeconverter.info";
const variations = [
    '/api/cus-login',
    '/api/cus_login',
    '/api/login',
    '/api/auth/login',
    '/api/customer/login',
    '/api/user/login',
    '/cus-login',
    '/login',
    '/api/cus-verifyphone'
];

async function probe() {
    for (const ep of variations) {
        try {
            console.log(`Probing ${domain}${ep}...`);
            const response = await axios.post(`${domain}${ep}`, {
                phone: "01958666967",
                email: "sumaiyaamrin6@gmail.com",
                password: "test"
            }, { timeout: 10000 });
            console.log(`✅ ${ep}: ${response.status} ${JSON.stringify(response.data).substring(0, 100)}`);
        } catch (error) {
            if (error.response) {
                console.log(`❌ ${ep}: ${error.response.status}`);
                if (error.response.status !== 404) {
                    console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 100)}`);
                }
            } else {
                console.log(`❌ ${ep}: ${error.message}`);
            }
        }
    }
}

probe();
