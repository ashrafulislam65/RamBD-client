const https = require('https');

https.get('https://admin.unicodeconverter.info/home', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            console.log('Top level keys:', Object.keys(jsonData));
            for (const key in jsonData) {
                const val = jsonData[key];
                if (Array.isArray(val)) {
                    console.log(`Key "${key}" is an array of length ${val.length}`);
                    if (val.length > 0) {
                        console.log(`  Sample item keys for "${key}":`, Object.keys(val[0]));
                    }
                } else if (typeof val === 'object' && val !== null) {
                    console.log(`Key "${key}" is an object with keys:`, Object.keys(val));
                } else {
                    console.log(`Key "${key}" is:`, val);
                }
            }
        } catch (e) {
            console.error('Failed to parse:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
