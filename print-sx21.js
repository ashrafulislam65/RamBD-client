const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args)).catch(() => globalThis.fetch(...args));

async function getSX21() {
    const res = await fetch('https://admin.unicodeconverter.info/LatestProductList/getAllLatestProducts');
    const data = await res.json();
    const p = (data.products || []).find(x => x.id === 2);
    console.log('=== RAW API DATA FOR SX21 (ID: 2) ===');
    console.log(JSON.stringify(p, null, 2));
}

getSX21();
