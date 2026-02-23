const https = require('https');

const phones = ['01958666975', '1958666975', '8801958666975', '+8801958666975'];

async function test(phone) {
    return new Promise((resolve) => {
        const encodedPhone = encodeURIComponent(phone);
        const url = `https://admin.unicodeconverter.info/api/generate-otp?phone=${encodedPhone}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[${phone}] Status [${res.statusCode}]:`, data);
                resolve(data);
            });
        }).on('error', err => {
            console.error(`Error:`, err.message);
            resolve(null);
        });
    });
}

async function run() {
    for (const phone of phones) {
        await test(phone);
    }
}

run();
