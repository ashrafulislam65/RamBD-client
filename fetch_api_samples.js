const https = require('https');
const fs = require('fs');

const urls = {
    latest: 'https://admin.felnatech.com/LatestProductList/getAllLatestProducts',
    popular: 'https://admin.felnatech.com/most-popular-product',
    topRated: 'https://admin.felnatech.com/top-rated-product'
};

async function fetchData(url, fileName) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                fs.writeFileSync(fileName, data.substring(0, 5000));
                console.log(`Saved first 5000 chars of ${url} to ${fileName}`);
                resolve();
            });
        }).on('error', (err) => {
            console.error(`Error fetching ${url}:`, err);
            reject(err);
        });
    });
}

async function run() {
    await fetchData(urls.latest, 'latest_products.json');
    await fetchData(urls.popular, 'popular_products.json');
    await fetchData(urls.topRated, 'top_rated_products.json');
}

run();
