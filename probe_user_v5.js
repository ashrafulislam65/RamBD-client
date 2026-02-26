const axios = require('axios');

const domains = [
    "https://admin.unicodeconverter.info",
    "https://admin.felnatech.com"
];

async function probeUser() {
    const variations = [
        "/api/user-list/1",
        "/api/user",
        "/api/customer/profile",
        "/api/cus-profile"
    ];

    for (const domain of domains) {
        for (const ep of variations) {
            const url = `${domain}${ep}`;
            console.log(`\nProbing: ${url}`);
            try {
                const response = await axios.get(url, { timeout: 5000 });
                console.log(`✅ Success: ${response.status}`);
                console.log(`   Data: ${JSON.stringify(response.data, null, 2).substring(0, 300)}`);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    console.log(`❓ ${error.response.status}: ${url}`);
                    console.log(`   Data: ${JSON.stringify(error.response.data)}`);
                }
            }
        }
    }
}

probeUser();
