const axios = require('axios');

const apiBaseUrl = 'https://admin.unicodeconverter.info';
const slug = 'neepho-np-61-microphone';
const model = 'NEEPHO-NP-61';

const variations = [
    `/api/products/reviews-data/${slug}/${model}`,
    `/api/products/reviews-data/${slug}`,
    `/api/products/reviews/${slug}/${model}`,
    `/api/products/reviews/${slug}`,
    `/api/reviews-data/${slug}/${model}`,
    `/api/reviews-data/${slug}`,
    `/api/reviews/${slug}/${model}`,
    `/api/reviews/${slug}`,
    `/products/reviews-data/${slug}/${model}`,
    `/products/reviews-data/${slug}`,
];

async function run() {
    console.log(`Testing for slug: ${slug}, model: ${model}`);
    for (const v of variations) {
        const url = apiBaseUrl + v;
        process.stdout.write(`Testing GET  ${v} ... `);
        try {
            const res = await axios.get(url, { timeout: 5000 });
            console.log(`SUCCESS (${res.status})`);
            if (res.data && (res.data.proReview || res.data.reviews || Array.isArray(res.data))) {
                console.log("   -> Data looks like reviews!");
            }
        } catch (err) {
            console.log(`FAILED (${err.response ? err.response.status : err.message})`);
        }

        process.stdout.write(`Testing POST ${v} ... `);
        try {
            const res = await axios.post(url, { slug: slug }, { timeout: 5000 });
            console.log(`SUCCESS (${res.status})`);
        } catch (err) {
            console.log(`FAILED (${err.response ? err.response.status : err.message})`);
        }
    }
}

run();
