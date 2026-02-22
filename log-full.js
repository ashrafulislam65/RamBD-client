const https = require('https');

https.get('https://admin.unicodeconverter.info/home', (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        console.log('LENGTH:', body.length);
        console.log('CONTENT:', body);
    });
}).on('error', e => console.error(e));
