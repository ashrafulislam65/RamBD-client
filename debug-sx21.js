const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args)).catch(() => globalThis.fetch(...args));

async function debugSX21() {
    const slug = 'sx21';
    console.log(`--- Debugging API for slug: ${slug} ---\n`);

    const endpoints = [
        { name: 'Latest Products', url: 'https://admin.unicodeconverter.info/LatestProductList/getAllLatestProducts' },
        { name: 'Most Popular', url: 'https://admin.unicodeconverter.info/most-popular-product' },
        { name: 'Direct Slug API', url: `https://admin.unicodeconverter.info/api/products/slug?slug=${slug}` }
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Checking ${endpoint.name}...`);
            const res = await fetch(endpoint.url);
            if (!res.ok) {
                console.log(`Failed to fetch from ${endpoint.name} (Status: ${res.status})\n`);
                continue;
            }

            const data = await res.json();
            let found = null;

            // Handle different response structures
            const products = data.products || data.populars || (Array.isArray(data) ? data : (data.id ? [data] : []));

            if (Array.isArray(products)) {
                found = products.find(p => p.pro_slug === slug || p.slug === slug);
            } else if (data && (data.pro_slug === slug || data.slug === slug)) {
                found = data;
            }

            if (found) {
                console.log(`✅ FOUND in ${endpoint.name}!`);
                console.log('Raw Data:', JSON.stringify(found, null, 2));
                console.log('\n');
            } else {
                console.log(`❌ Not found in ${endpoint.name}.\n`);
            }
        } catch (error) {
            console.log(`Error checking ${endpoint.name}: ${error.message}\n`);
        }
    }
}

debugSX21();
