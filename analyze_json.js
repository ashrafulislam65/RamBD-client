const fs = require('fs');
const data = JSON.parse(fs.readFileSync('full_data.json', 'utf8'));

const allInOneId = 38;
const matches = data.subCategory.filter(s => s.parent_id === allInOneId);

console.log(`Found ${matches.length} items in root "subCategory" with parent_id: ${allInOneId}`);
if (matches.length > 0) {
    console.log('Matches:', matches.map(m => m.cate_name).join(', '));
} else {
    console.log('No matches found for All In One');
}

// Let's check if ANY item in subCategory has a parent_id that is NOT in data.menu.category
const allCategoryIds = data.menu.map(m => m.category.id);
const deepOrphans = data.subCategory.filter(s => !allCategoryIds.includes(s.parent_id));
console.log(`Total deep orphans in "subCategory": ${deepOrphans.length}`);
if (deepOrphans.length > 0) {
    console.log('Sample deep orphan:', deepOrphans[0].cate_name, 'parent_id:', deepOrphans[0].parent_id);
}
