const https = require('https');

function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => resolve(false));
    });
}

const suggestUrl = 'https://admin.felnatech.com/products/searchsuggest?search=desktop';

https.get(suggestUrl, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', async () => {
        try {
            const json = JSON.parse(data);
            console.log("Suggest API isArray:", Array.isArray(json));
            if (Array.isArray(json) && json.length > 0) {
                console.log("First suggestion:", JSON.stringify(json[0], null, 2));
                if (json[0].image) {
                    console.log("Image property:", json[0].image);
                }
            } else {
                console.log("Suggest API returned non-array or empty:", JSON.stringify(json, null, 2).substring(0, 500));
            }

            // Check image paths
            const filename = "intel-felnatech-14-1.png";
            const paths = [
                `https://admin.felnatech.com/images/${filename}`,
                `https://admin.felnatech.com/public/uploads/products/thumbnail/${filename}`,
                `https://admin.felnatech.com/public/uploads/all/${filename}`,
                `https://admin.felnatech.com/storage/app/public/products/${filename}`,
                `https://admin.felnatech.com/uploads/all/${filename}`
            ];

            for (const p of paths) {
                const exists = await checkUrl(p);
                console.log(`Path ${p}: ${exists ? "EXISTS" : "Not found"}`);
            }

        } catch (e) {
            console.log("Error:", e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
