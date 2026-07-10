const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

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

const files = getFiles(COMPONENTS_DIR);
let modifiedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace Link
  newContent = newContent.replace(/import\s+{([^}]*)\bLink\b([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
    let newImport = match.replace(/\bLink\b,?\s*/, '');
    if (newImport.includes('{}')) newImport = '';
    return `import Link from 'next/link';\n${newImport}`;
  });

  // useNavigate -> useRouter
  newContent = newContent.replace(/import\s+{([^}]*)\buseNavigate\b([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
    return `import { useRouter } from 'next/navigation';\n`;
  });
  newContent = newContent.replace(/useNavigate\(\)/g, 'useRouter()');

  // useParams -> useParams (next/navigation)
  newContent = newContent.replace(/import\s+{([^}]*)\buseParams\b([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
    return `import { useParams } from 'next/navigation';\n`;
  });
  
  // useLocation -> usePathname (next/navigation)
  newContent = newContent.replace(/import\s+{([^}]*)\buseLocation\b([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, p1, p2) => {
    return `import { usePathname } from 'next/navigation';\n`;
  });
  newContent = newContent.replace(/useLocation\(\)/g, 'usePathname()');

  if (newContent !== content) {
    // Also ensure 'use client' is at the top if we use hooks
    if ((newContent.includes('useRouter(') || newContent.includes('usePathname(') || newContent.includes('useParams(')) && !newContent.includes('"use client"')) {
      newContent = '"use client";\n\n' + newContent;
    }
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
  }
}

console.log(`Fixed react-router-dom in ${modifiedCount} components.`);
