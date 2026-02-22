const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args)).catch(() => globalThis.fetch(...args));

async function findSX21() {
    const targetSlug = 'sx21';
    const apiBaseUrl = 'https://admin.unicodeconverter.info';

    const endpoints = [
        { name: 'Latest Products', url: `${apiBaseUrl}/LatestProductList/getAllLatestProducts`, key: 'products' },
        { name: 'Most Popular', url: `${apiBaseUrl}/most-popular-product`, key: 'populars' },
        { name: 'Top Rated', url: `${apiBaseUrl}/top-rated-product`, key: 'products' }
    ];

    console.log(`Searching for product with slug: "${targetSlug}"...\n`);

    for (const ep of endpoints) {
        try {
            const res = await fetch(ep.url);
            if (!res.ok) continue;

            const data = await res.json();
            const list = data[ep.key] || [];

            const found = list.find(p => p.pro_slug === targetSlug || p.slug === targetSlug);

            if (found) {
                console.log(`✅ FOUND in [${ep.name}] API:`);
                console.log(JSON.stringify(found, null, 2));
                return;
            }
        } catch (e) { }
    }

    // If not found in main lists, try categories
    try {
        const menuRes = await fetch(`${apiBaseUrl}/home-menu`);
        const menuData = await menuRes.json();
        const categories = (menuData.menu || []).map(m => m.category.cate_slug);

        for (const catSlug of categories) {
            const catRes = await fetch(`${apiBaseUrl}/product/product-category-items?slug=${catSlug}`);
            if (!catRes.ok) continue;
            const catData = await catRes.json();
            const products = catData.products || [];
            const found = products.find(p => p.pro_slug === targetSlug || p.slug === targetSlug);
            if (found) {
                console.log(`✅ FOUND in Category API [${catSlug}]:`);
                console.log(JSON.stringify(found, null, 2));
                return;
            }
        }
    } catch (e) { }

    console.log('❌ Product not found in any standard API endpoints.');
}

findSX21();
