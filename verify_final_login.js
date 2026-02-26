const axios = require('axios');

const normalizePhone = (phone) => {
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("880") && digits.length > 11) {
        digits = digits.substring(2);
    }
    if (digits.length === 10 && digits.startsWith("1")) {
        digits = "0" + digits;
    }
    return digits;
};

async function testFinalLogin() {
    const apiBaseUrl = "https://admin.unicodeconverter.info";
    const url = `${apiBaseUrl}/api/customer-login-page`;

    const rawPhone = "01958666966";
    const payload = {
        email: normalizePhone(rawPhone),
        password: "wrong_password_test"
    };

    console.log(`🚀 Testing Final Logic with URL: ${url}`);
    console.log(`📦 Payload: ${JSON.stringify(payload)}`);

    try {
        const response = await axios.post(url, payload, { timeout: 10000 });
        console.log('✅ Success Status:', response.status);
        console.log('✅ Success Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log('✅ Correctly handled error from server:');
            console.log('   Status:', error.response.status);
            console.log('   Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('❌ Unexpected Error:', error.message);
        }
    }
}

testFinalLogin();
