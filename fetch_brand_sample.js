const https = require('https');
const fs = require('fs');

const url = 'https://admin.felnatech.com/brand/getAllBrandsLast';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('brand_sample.json', data.substring(0, 5000));
        console.log('Saved first 5000 chars to brand_sample.json');
    });
}).on('error', (err) => {
    console.error('Error:', err);
});
