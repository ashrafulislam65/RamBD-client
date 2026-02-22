const https = require('https');

https.get('https://admin.unicodeconverter.info/home', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const jsonData = JSON.parse(data);
            for (const key in jsonData) {
                const val = jsonData[key];
                if (Array.isArray(val)) {
                    console.log(`Key "${key}": Array(${val.length})`);
                } else if (val && typeof val === 'object') {
                    console.log(`Key "${key}": Object(${Object.keys(val).length})`);
                } else {
                    console.log(`Key "${key}": ${val}`);
                }
            }
        } catch (e) {
            console.error('Failed to parse');
        }
    });
});
