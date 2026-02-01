const fs = require('fs');
const content = fs.readFileSync('felnatech_home.html', 'utf8');
const urls = content.match(/https?:\/\/[^"'\s]+\.(?:jpg|png|webp|jpeg)/gi);
if (urls) {
    const productUrls = urls.filter(url => url.includes('product'));
    console.log(productUrls.slice(0, 5));
} else {
    console.log('No URLs found');
}
