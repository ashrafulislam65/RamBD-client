const fs = require('fs');

try {
    const content = fs.readFileSync('felnatech_home.html', 'utf8');
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    const matches = [];

    while ((match = imgRegex.exec(content)) !== null) {
        matches.push(match[1]);
    }

    console.log("Found images:", matches.length);
    matches.forEach(src => console.log(src));
} catch (error) {
    console.error("Error reading file:", error.message);
}
