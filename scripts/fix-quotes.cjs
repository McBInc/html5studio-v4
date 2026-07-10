const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '../src/app');

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

const files = getFiles(APP_DIR);
let modifiedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  
  let newContent = content;
  
  // Fix quote mismatch from previous script
  // e.g. from '@/components/landing/Footer"; -> from '@/components/landing/Footer';
  newContent = newContent.replace(/from '@\/([^"']+)"/g, "from '@/$1'");
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
  }
}

console.log(`Fixed quotes in ${modifiedCount} files.`);
