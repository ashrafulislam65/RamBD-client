const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'product_final_verify_v2.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('--- Metadata Verification ---');

const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1].trim() : 'NOT FOUND');

const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i);
console.log('Description:', descMatch ? descMatch[1].trim() : 'NOT FOUND');

const keysMatch = content.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([\s\S]*?)["']/i);
console.log('Keywords:', keysMatch ? keysMatch[1].trim() : 'NOT FOUND');
