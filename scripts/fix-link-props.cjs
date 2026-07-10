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
  
  // Replace <Link to=... with <Link href=...
  // Handles <Link to="...", <Link to={`...`}, <Link \n to=...
  let newContent = content.replace(/<Link([^>]*?)\bto\s*=\s*(['"{])/g, '<Link$1href=$2');
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
  }
}

console.log(`Changed <Link to=> to <Link href=> in ${modifiedCount} files.`);
