const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args)).catch(() => globalThis.fetch(...args));

async function checkCategoryAPI() {
    const slug = 'microphone';
    const url = `https://admin.unicodeconverter.info/product/product-category-items/${slug}?page=1&limit=5`;

    try {
        console.log(`Fetching: ${url}`);
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.products && data.products.data && data.products.data.length > 0) {
            const p = data.products.data[0];
            console.log('=== Raw Category Product Sample ===');
            console.log('Title:', p.pro_title || p.product_title || p.title);
            console.log('Price Keys:', Object.keys(p).filter(k => k.includes('price')));
            console.log('Discount Keys:', Object.keys(p).filter(k => k.includes('discount')));
            console.log('Offer Keys:', Object.keys(p).filter(k => k.includes('offer')));
            console.log('\nFull Product Object (first 500 chars):');
            console.log(JSON.stringify(p, null, 2).substring(0, 1000));
        } else {
            console.log('No products found in category response.');
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkCategoryAPI();
