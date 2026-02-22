const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args)).catch(() => globalThis.fetch(...args));

async function checkTrypodAPI() {
    const apiBaseUrl = 'https://admin.unicodeconverter.info';

    try {
        // 1. Check main Trypod category
        console.log('--- Checking Trypod Category ---');
        const trypodRes = await fetch(`${apiBaseUrl}/product/product-category-items/trypod?page=1&limit=5`);
        const trypodData = await trypodRes.json();

        if (trypodData.products && trypodData.products.data && trypodData.products.data.length > 0) {
            const p = trypodData.products.data[0];
            console.log(`Product: ${p.pro_title}`);
            console.log(`Price: ${p.pro_price}, Discount: ${p.pro_discount}, Offer: ${p.offer_status}`);
        } else {
            console.log('No products found in Trypod category.');
        }

        // 2. Check for subcategories in Trypod
        console.log('\n--- Checking Home Menu for Trypod subcategories ---');
        const menuRes = await fetch(`${apiBaseUrl}/home-menu`);
        const menuData = await menuRes.json();
        const trypodMenu = (menuData.menu || []).find(m => m.category.cate_slug === 'trypod');

        if (trypodMenu && trypodMenu.category.sub_categories) {
            console.log('Subcategories found:', trypodMenu.category.sub_categories.map(s => s.sub_cate_slug));

            for (const sub of trypodMenu.category.sub_categories.slice(0, 2)) {
                console.log(`\nChecking Subcategory: ${sub.sub_cate_slug}`);
                const subRes = await fetch(`${apiBaseUrl}/product/product-subcategory-items?slug=${sub.sub_cate_slug}`);
                const subData = await subRes.json();
                const p = (subData.products || subData.products?.data || [])[0];
                if (p) {
                    console.log(`Product: ${p.pro_title}`);
                    console.log(`Price: ${p.pro_price}, Discount: ${p.pro_discount}, Offer: ${p.offer_status}`);
                } else {
                    console.log('No products found in this subcategory.');
                }
            }
        } else {
            console.log('No subcategories explicitly found in menu for Trypod.');
        }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkTrypodAPI();
