const axios = require('axios');

const domains = [
    "https://admin.unicodeconverter.info",
    "https://admin.felnatech.com"
];

async function probeUser() {
    const phone = "01958666966";
    const variations = [
        "/get-user-by-phone",
        "/get-customer-by-phone",
        "/customer/get-user-by-phone",
        "/api/get-user-by-phone"
    ];

    for (const domain of domains) {
        for (const ep of variations) {
            const url = `${domain}${ep}`;
            console.log(`\nProbing: ${url} with phone ${phone}`);
            try {
                const response = await axios.get(url, {
                    params: { phone },
                    timeout: 5000
                });
                console.log(`✅ Success: ${response.status}`);
                console.log(`   Data: ${JSON.stringify(response.data, null, 2).substring(0, 500)}`);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    console.log(`❓ ${error.response.status}: ${url}`);
                    console.log(`   Data: ${JSON.stringify(error.response.data)}`);
                } else if (!error.response) {
                    console.log(`❌ Error: ${error.message}`);
                } else {
                    console.log(`🚫 404: ${url}`);
                }
            }
        }
    }
}

probeUser();
