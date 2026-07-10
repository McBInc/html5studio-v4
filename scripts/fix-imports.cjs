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
  
  // Replace relative imports with aliases
  newContent = newContent.replace(/from ['"](\.\.\/)+components\//g, "from '@/components/");
  newContent = newContent.replace(/from ['"](\.\.\/)+lib\//g, "from '@/lib/");
  newContent = newContent.replace(/from ['"](\.\.\/)+hooks\//g, "from '@/hooks/");
  newContent = newContent.replace(/from ['"](\.\.\/)+utils\//g, "from '@/utils/");
  newContent = newContent.replace(/from ['"](\.\.\/)+api\//g, "from '@/api/");
  
  newContent = newContent.replace(/from ['"]\.\/components\//g, "from '@/components/");
  
  // Edge cases where the import is just `from '../../components'` (no trailing slash)
  newContent = newContent.replace(/from ['"](\.\.\/)+components['"]/g, "from '@/components'");
  newContent = newContent.replace(/from ['"](\.\.\/)+lib['"]/g, "from '@/lib'");
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
  }
}

console.log(`Fixed imports in ${modifiedCount} files.`);
