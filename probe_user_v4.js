const axios = require('axios');

const domains = [
    "https://admin.unicodeconverter.info",
    "https://admin.felnatech.com"
];

async function probeUser() {
    const phone = "01958666966";
    const variations = [
        "/api/get-cus-by-phone",
        "/api/get-customer-by-phone",
        "/api/customer",
        "/api/customer-profile",
        "/api/profile-details"
    ];

    for (const domain of domains) {
        for (const ep of variations) {
            const url = `${domain}${ep}`;
            process.stdout.write(`\rProbing: ${url} ...`);
            try {
                const response = await axios.get(url, { params: { phone }, timeout: 5000 });
                console.log(`\n✅ Success: ${response.status}`);
                console.log(`   Data: ${JSON.stringify(response.data, null, 2).substring(0, 200)}`);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    console.log(`\n❓ ${error.response.status}: ${url}`);
                    console.log(`   Data: ${JSON.stringify(error.response.data)}`);
                }
            }
        }
    }
    console.log('\nDone.');
}

probeUser();
