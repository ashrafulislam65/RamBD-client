const https = require('https');
const fs = require('fs');

const log = [];
function logMsg(msg) {
    console.log(msg);
    log.push(msg);
}

function checkUrl(url) {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD' }, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.end();
    });
}

const searchProUrl = 'https://admin.felnatech.com/products/searchpro?search=desktop';

https.get(searchProUrl, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', async () => {
        try {
            const json = JSON.parse(data);
            logMsg("SearchPro Root keys: " + JSON.stringify(Object.keys(json)));
            if (json.products) {
                if (Array.isArray(json.products)) {
                    logMsg("SearchPro products is Array. Len: " + json.products.length);
                } else {
                    logMsg("SearchPro products is Object. Keys: " + JSON.stringify(Object.keys(json.products)));
                    if (json.products.data) {
                        logMsg("SearchPro products.data is Array. Len: " + json.products.data.length);
                        if (json.products.data.length > 0) {
                            logMsg("First Product Sample: " + JSON.stringify(json.products.data[0], null, 2));
                        }
                    }
                }
            }

            // Check Image URL from suggestion response knowledge
            const imgName = "desktop-felnatech-1474-1.png";
            const baseUrl = "https://admin.felnatech.com";
            const paths = [
                `/public/uploads/all/${imgName}`,
                `/uploads/all/${imgName}`,
                `/storage/app/public/products/${imgName}`,
                `/images/${imgName}`
            ];

            for (const p of paths) {
                const fullUrl = baseUrl + p;
                const exists = await checkUrl(fullUrl);
                logMsg(`Image check ${fullUrl}: ${exists}`);
            }

            fs.writeFileSync('image-check-result.txt', log.join('\n'));
            console.log("Result written to image-check-result.txt");

        } catch (e) {
            logMsg("Error: " + e.message);
            fs.writeFileSync('image-check-result.txt', log.join('\n'));
        }
    });

}).on("error", (err) => {
    logMsg("Error: " + err.message);
    fs.writeFileSync('image-check-result.txt', log.join('\n'));
});
