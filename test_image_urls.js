const https = require('https');

const imageName = 'dji-felnatech-6526-1.png';
const baseUrls = [
    'https://rambd.com/storage/app/public/uploads/product',
    'https://admin.felnatech.com/storage/app/public/uploads/product',
    'https://felnatech.com/storage/app/public/uploads/product',
    'https://admin.felnatech.com/public/uploads/product',
    'https://admin.felnatech.com/uploads/product',
    'https://felnatech.com/public/uploads/product',
    'https://rambd.com/public/uploads/product',
];

baseUrls.forEach(baseUrl => {
    const url = `${baseUrl}/${imageName}`;
    https.get(url, (res) => {
        console.log(`${url} => Status: ${res.statusCode}`);
    }).on('error', (e) => {
        console.error(`${url} => Error: ${e.message}`);
    });
});
