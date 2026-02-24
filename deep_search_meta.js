const fs = require('fs');

function deepSearch(obj, targetKeys, path = '') {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
        obj.forEach((item, index) => deepSearch(item, targetKeys, `${path}[${index}]`));
        return;
    }

    for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        const keyLower = key.toLowerCase();

        if (targetKeys.some(tk => keyLower.includes(tk))) {
            console.log(`FOUND: ${currentPath} = ${JSON.stringify(obj[key]).substring(0, 200)}`);
        }

        if (obj[key] && typeof obj[key] === 'object') {
            deepSearch(obj[key], targetKeys, currentPath);
        }
    }
}

const targetKeys = ['meta', 'seo', 'keyword', 'description'];
const files = ['home_api_utf8.json', 'latest_products_utf8.json', 'home_api_content.json', 'home-api-debug.json'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    console.log(`\n=== Analyzing ${file} ===`);
    try {
        const content = fs.readFileSync(file, 'utf8');
        // raw search first in case JSON is mangled
        targetKeys.forEach(tk => {
            if (content.toLowerCase().includes(tk)) {
                console.log(`Raw match for "${tk}" found in ${file}`);
            }
        });

        try {
            const data = JSON.parse(content.replace(/^\uFEFF/, ''));
            deepSearch(data, targetKeys);
        } catch (je) {
            console.log(`JSON parse error for ${file}: ${je.message}`);
        }
    } catch (e) {
        console.log(`Error reading ${file}: ${e.message}`);
    }
});
