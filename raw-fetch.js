const https = require('https');

https.get('https://admin.unicodeconverter.info/home', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('--- RAW START ---');
        console.log(data);
        console.log('--- RAW END ---');
        try {
            const json = JSON.parse(data);
            console.log('Keys:', Object.keys(json));
            if (json.sliders) console.log('Sliders Length:', json.sliders.length);
        } catch (e) {
            console.log('JSON Parse Failed');
        }
    });
});
