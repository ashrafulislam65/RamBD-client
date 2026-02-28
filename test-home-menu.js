
const url = "https://admin.unicodeconverter.info/home-menu";

async function testFetch() {
    console.log(`Testing fetch to: ${url}`);
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (response.ok) {
            const data = await response.json();
            console.log(`Success! Data received. Menus: ${data.menu ? data.menu.length : 0}`);
        } else {
            console.log("Response not OK");
        }
    } catch (error) {
        console.error("Fetch failed!");
        console.error("Error message:", error.message);
        if (error.cause) console.error("Error cause:", error.cause);
    }
}

testFetch();
