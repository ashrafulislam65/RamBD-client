const fs = require('fs');

function checkFile(filename) {
    if (!fs.existsSync(filename)) return;
    console.log(`Checking ${filename}...`);
    const buffer = fs.readFileSync(filename);
    let content;

    // Check for UTF-16LE BOM (0xFF 0xFE)
    if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
        content = buffer.toString('utf16le');
    } else {
        content = buffer.toString('utf8');
    }

    try {
        const data = JSON.parse(content.replace(/^\uFEFF/, ''));
        const products = data.products || (Array.isArray(data) ? data : []);
        if (products.length > 0) {
            const p = products[0];
            console.log('Product Keys:', Object.keys(p).filter(k => k.includes('meta')));
            console.log('Meta Keyword:', p.meta_keyword);
            console.log('Meta Description:', p.meta_description);
            console.log('Pro Meta Keyword:', p.pro_meta_keyword);
            console.log('Pro Meta Description:', p.pro_meta_description);
        } else {
            console.log('No products found in data');
        }
    } catch (e) {
        console.log('JSON Parse Error:', e.message);
        // Fallback: search raw string
        const metaKeys = content.match(/\"(meta_[^\"]*|pro_meta_[^\"]*)\":/gi);
        console.log('Raw meta keys found:', metaKeys ? [...new Set(metaKeys)] : 'None');
    }
}

checkFile('latest_products_utf8.json');
checkFile('latest-products-debug.json');
