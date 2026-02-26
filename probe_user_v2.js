const axios = require('axios');

const domains = [
    "https://admin.unicodeconverter.info",
    "https://admin.felnatech.com"
];

async function probeUser() {
    const phone = "01958666966";
    for (const domain of domains) {
        const url = `${domain}/api/get-user-by-phone`;
        console.log(`\nProbing: ${url} with phone ${phone}`);
        try {
            const response = await axios.get(url, { params: { phone }, timeout: 5000 });
            console.log(`✅ Success: ${response.status}`);
            console.log(`   Data: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            console.log(`❌ Error: ${error.response?.status || error.message}`);
            if (error.response?.data) {
                console.log(`   Data: ${JSON.stringify(error.response.data)}`);
            }
        }
    }
}

probeUser();
