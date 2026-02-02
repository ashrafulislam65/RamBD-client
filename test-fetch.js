const url = "https://admin.felnatech.com/product/product-category-items/some-slug?page=1&limit=20";

console.log(`Testing fetch to: ${url}`);

fetch(url)
    .then(res => {
        console.log(`Status: ${res.status}`);
        return res.text();
    })
    .then(text => console.log(`Response length: ${text.length}`))
    .catch(err => {
        console.error("Fetch failed!");
        console.error(err);
        if (err.cause) console.error("Cause:", err.cause);
    });
