const fetch = require('node-fetch');

async function checkUrl(url, label) {
    console.log(`\n--- ${label} (${url}) ---`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to fetch: ${response.status}`);
            return;
        }
        const text = await response.content(); // Use .text() or equivalent based on environment
        // wait, node-fetch uses .text()
    } catch (e) { }
}

// Rewriting for standard node fetch or just simple shell commands if fetch isn't there
