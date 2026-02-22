const https = require('https');

https.get('https://admin.unicodeconverter.info/home', (res) => {
    let b = '';
    res.on('data', d => b += d);
    res.on('end', () => {
        try {
            const j = JSON.parse(b);
            console.log('KEYS:', Object.keys(j));
        } catch (e) {
            console.log('NOT JSON');
        }
    });
}).on('error', e => console.log('ERROR:', e.message));
