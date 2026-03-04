
const { default: api } = require('./src/utils/__api__/products');

async function test() {
    console.log("Testing getRelatedProducts with slug 'rambd'...");
    try {
        const products = await api.getRelatedProducts("rambd");
        console.log(`Found ${products.length} products`);
        if (products.length > 0) {
            console.log("First product title:", products[0].title);
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

test();
