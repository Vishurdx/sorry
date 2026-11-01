/**
 * Production Static Build Script for apology-for-baby
 * Generates the clean production distribution in /dist for Vercel and static hosting.
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Starting production build...');

// 1. Clean existing dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 2. Helper to copy single file
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`  ✓ Copied ${path.relative(rootDir, src)} -> ${path.relative(rootDir, dest)}`);
}

// 3. Helper to recursively copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`  ✓ Copied directory ${path.relative(rootDir, src)}/ -> ${path.relative(rootDir, dest)}/`);
}

// 4. Copy core static files
const staticFiles = ['index.html', 'style.css'];
for (const file of staticFiles) {
  const srcPath = path.join(rootDir, file);
  if (fs.existsSync(srcPath)) {
    copyFile(srcPath, path.join(distDir, file));
  } else {
    console.error(`❌ Error: Required static file "${file}" not found!`);
    process.exit(1);
  }
}

// 5. Copy assets folder (photos, stickers, mascots, illustrations)
const assetsDir = path.join(rootDir, 'assets');
if (fs.existsSync(assetsDir)) {
  copyDir(assetsDir, path.join(distDir, 'assets'));
} else {
  console.warn('⚠️ Warning: "assets" directory not found.');
}

console.log('\n✨ Production build complete! All static files are ready in /dist.');
