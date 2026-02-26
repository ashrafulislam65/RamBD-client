
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
        if (data.menu) {
            const trypodMenu = data.menu.find(m => m.category.cate_name.toLowerCase().includes('trypod'));
            if (trypodMenu) {
                console.log('--- TRYPOD MAIN CATEGORY ---');
                console.log(trypodMenu.category.cate_name, ':', trypodMenu.category.cate_icon);

                const catId = trypodMenu.category.id;
                const subs = data.subCategory.filter(s => s.parent_id == catId);
                console.log('\n--- TRYPOD SUBCATEGORIES ---');
                subs.forEach(s => {
                    console.log(`[SUB] ${s.cate_name}: ${s.cate_icon || 'MISSING'}`);
                });
            } else {
                console.log('Trypod menu not found in main menu');
            }
        }
    } catch (err) {
        console.error(err);
    }
}

testApi();
