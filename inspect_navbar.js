const fetch = require('node-fetch');

async function test() {
    const apiBaseUrl = "https://admin.unicodeconverter.info";
    try {
        const response = await fetch(`${apiBaseUrl}/home-menu`);
        if (!response.ok) {
            console.error('Fetch failed with status:', response.status);
            return;
        }
        const data = await response.json();
        console.log('Keys in /home-menu:', Object.keys(data));
        if (data.categories && data.categories.length > 0) {
            console.log('First category sample:', JSON.stringify(data.categories[0], null, 2));
        }
        // Also check if there's any global meta object in the response
        const topLevelMeta = Object.keys(data).filter(k => k.toLowerCase().includes('meta'));
        if (topLevelMeta.length > 0) {
            console.log('Top level meta keys found:', topLevelMeta);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
