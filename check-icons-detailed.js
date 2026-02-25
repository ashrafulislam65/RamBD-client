
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
        console.log('--- ICON ANALYSIS ---');
        const counts = {};
        if (data.menu) {
            data.menu.filter(m => m.checked == 1).forEach(m => {
                const name = m.category.cate_name;
                const icon = m.category.cate_icon || 'MISSING';
                counts[icon] = (counts[icon] || 0) + 1;
                console.log(`${name}: ${icon}`);
            });
        }
        console.log('\n--- COUNTS ---');
        console.log(JSON.stringify(counts, null, 2));
    } catch (err) {
        console.error(err);
    }
}

testApi();
