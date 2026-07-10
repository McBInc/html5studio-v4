const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getFiles(SRC_DIR);
let modifiedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  
  let newContent = content.replace(/import\s*{\s*}\s*from\s*['"]react-router-dom['"];?/g, '');
  newContent = newContent.replace(/import\s*['"]react-router-dom['"];?/g, '');
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
  }
}

console.log(`Cleaned up empty react-router-dom imports in ${modifiedCount} files.`);
