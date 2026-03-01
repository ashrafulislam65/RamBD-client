const axios = require('axios');

const apiBaseUrl = 'https://admin.unicodeconverter.info';

async function probe() {
    let slug = 'some-product-slug';
    let model = 'some-model';

    console.log("Fetching a real product to test...");
    try {
        const latestRes = await axios.get(`${apiBaseUrl}/LatestProductList/getAllLatestProducts`);
        if (latestRes.data && latestRes.data.products && latestRes.data.products.length > 0) {
            const p = latestRes.data.products[0];
            slug = p.pro_slug || p.slug;
            model = p.pro_model || p.model;
            console.log(`Using real product: slug=${slug}, model=${model}`);
        }
    } catch (err) {
        console.log("Failed to fetch real product, using defaults.");
    }

    const urls = [
        `${apiBaseUrl}/api/products/reviews-data/${slug}/${model}`,
        `${apiBaseUrl}/api/products/reviews/${slug}/${model}`,
        `${apiBaseUrl}/api/products/reviews-data/${slug}`,
        `${apiBaseUrl}/api/products/reviews/${slug}`,
        `${apiBaseUrl}/api/reviews/${slug}/${model}`,
    ];

    for (const url of urls) {
        console.log(`\nProbing URL: ${url}`);

        // Test GET
        try {
            const res = await axios.get(url);
            console.log(`GET SUCCESS: Status ${res.status}`);
            // console.log("Data:", JSON.stringify(res.data).substring(0, 100));
        } catch (err) {
            console.log(`GET FAILED: Status ${err.response ? err.response.status : err.message}`);
        }

        // Test POST
        try {
            const res = await axios.post(url, { rating: 5, message: "test", client_id: 1, slug: slug });
            console.log(`POST SUCCESS: Status ${res.status}`);
        } catch (err) {
            console.log(`POST FAILED: Status ${err.response ? err.response.status : err.message}`);
        }
    }
}

probe();
