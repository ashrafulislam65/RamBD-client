const https = require('https');
const fs = require('fs');

https.get('https://admin.felnatech.com/products/searchpro?search=desktop', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        try {
            fs.writeFileSync('api-response.json', data);
            console.log("File written");
        } catch (e) {
            console.log("Error:", e.message);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
