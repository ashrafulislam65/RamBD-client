
const https = require('https');

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Failed to parse JSON'));
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function testApi() {
    try {
        const data = await fetch('https://admin.unicodeconverter.info/home-menu');
        if (data.menu?.length > 0) {
            const cat = data.menu[0].category;
            console.log('Category keys:', Object.keys(cat));
            console.log('cate_name:', cat.cate_name);
            console.log('cate_icon:', cat.cate_icon);
            console.log('cate_icon_url:', cat.cate_icon_url);
        }
    } catch (err) {
        console.error(err);
    }
}

testApi();
