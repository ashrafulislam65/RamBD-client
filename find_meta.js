const fs = require('fs');

function findMeta(obj, path = '') {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        const keyLower = key.toLowerCase();
        if (keyLower.includes('meta') || keyLower.includes('seo') || keyLower.includes('keyword')) {
            console.log(`Found: ${currentPath} = ${JSON.stringify(obj[key]).substring(0, 100)}`);
        }
        if (obj[key] && typeof obj[key] === 'object') {
            findMeta(obj[key], currentPath);
        }
    }
}

const files = ['home_api_utf8.json', 'latest_products_utf8.json', 'home_api_content.json'];

files.forEach(file => {
    try {
        if (!fs.existsSync(file)) return;
        console.log(`--- Checking ${file} ---`);
        const content = fs.readFileSync(file, 'utf8');
        // Simple regex to find keys if JSON.parse fails
        if (content.includes('meta_description') || content.includes('meta_keyword')) {
            console.log(`${file} contains meta_description or meta_keyword via raw text check`);
        }

        try {
            const data = JSON.parse(content.replace(/^\uFEFF/, '')); // Handle BOM
            findMeta(data);
        } catch (je) {
            console.log(`${file} JSON parse error: ${je.message}`);
        }
    } catch (e) {
        console.log(`${file} error: ${e.message}`);
    }
});
