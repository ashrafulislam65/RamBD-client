const axios = require('axios');

const apiBaseUrl = "https://admin.unicodeconverter.info";
const phone = "01958666962"; // From user example
const token = "YOUR_TOKEN_HERE"; // We can't easily test auth-required ones without a real token, but we can check the error responses

const endpoints = [
    { url: `/api/set-password-otp/${phone}`, methods: ['POST', 'PUT'] },
    { url: `/api/set-new-password/${phone}`, methods: ['POST', 'PUT'] },
    { url: `/api/forgotpassword`, methods: ['POST', 'GET'] },
    { url: `/api/sendnewpassword`, methods: ['POST', 'PUT'] }
];

async function probe() {
    for (const ep of endpoints) {
        for (const method of ep.methods) {
            const url = `${apiBaseUrl}${ep.url}`;
            console.log(`\nTesting ${method} ${url}`);
            try {
                let res;
                if (method === 'POST') res = await axios.post(url, { phone }, { timeout: 5000 });
                else if (method === 'PUT') res = await axios.put(url, { phone }, { timeout: 5000 });
                else res = await axios.get(url, { params: { phone }, timeout: 5000 });

                console.log(`✅ Success (${res.status}):`, JSON.stringify(res.data).substring(0, 200));
            } catch (err) {
                if (err.response) {
                    console.log(`❌ Error (${err.response.status}):`, JSON.stringify(err.response.data));
                } else {
                    console.log(`❌ Error: ${err.message}`);
                }
            }
        }
    }
}

probe();
