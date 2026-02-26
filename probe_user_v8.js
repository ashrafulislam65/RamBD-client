const axios = require('axios');

const url = "https://admin.unicodeconverter.info/api/user";

async function probeUser() {
    console.log(`\nProbing with dummy token: ${url}`);
    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': 'Bearer dummy_token' },
            timeout: 5000
        });
        console.log(`✅ Success: ${response.status}`);
        console.log(`   Data: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
        console.log(`❌ Error: ${error.response?.status || error.message}`);
        if (error.response?.data) {
            console.log(`   Data: ${JSON.stringify(error.response.data)}`);
        }
    }
}

probeUser();
