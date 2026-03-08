const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MEETING_NOTES = path.join(ROOT, 'Meeting Notes');
const DIST = path.join(__dirname, 'dist');
const SLIDES_DIR = path.join(DIST, 'slides');

// Ensure output dirs exist
if (!fs.existsSync(SLIDES_DIR)) {
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
}

const mdFiles = fs.readdirSync(MEETING_NOTES)
  .filter((f) => f.endsWith('.md'))
  .sort((a, b) => {
    // Sort by date-ish: prefer "Month DD" or "Month DDth" at start
    const nameA = a.replace(/^(\w+)\s+(\d+).*/, '$1 $2');
    const nameB = b.replace(/^(\w+)\s+(\d+).*/, '$1 $2');
    return nameB.localeCompare(nameA);
  });

const marpPath = path.join(__dirname, 'node_modules', '.bin', 'marp');
const marpCmd = process.platform === 'win32' ? 'marp.cmd' : 'marp';

const manifest = [];

const usedSlugs = new Set();
function uniqueSlug(base) {
  let slug = base.replace(/\s+/g, '-').replace(/[^\w\-.]/g, '');
  if (!slug) slug = 'slide';
  let candidate = slug;
  let n = 0;
  while (usedSlugs.has(candidate)) candidate = `${slug}-${++n}`;
  usedSlugs.add(candidate);
  return candidate;
}

for (const file of mdFiles) {
  const base = path.basename(file, '.md');
  const safeSlug = uniqueSlug(base);
  const mdPath = path.join(MEETING_NOTES, file);
  const outPath = path.join(SLIDES_DIR, `${safeSlug}.html`);

  let title = base;
  try {
    const content = fs.readFileSync(mdPath, 'utf8');
    const firstHeading = content.match(/^#\s+(.+)$/m);
    if (firstHeading) title = firstHeading[1].trim();
  } catch (_) {}

  try {
    execSync(
      `"${path.join(__dirname, 'node_modules', '.bin', marpCmd)}" --no-stdin "${mdPath}" -o "${outPath}"`,
      { stdio: 'inherit', cwd: __dirname }
    );
  } catch (err) {
    console.error(`Marp failed for ${file}:`, err.message);
    continue;
  }

  manifest.push({ title, slug: safeSlug, file: base });
}

fs.writeFileSync(
  path.join(DIST, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

// Copy index.html into dist
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml);

console.log(`Built ${manifest.length} slides. Output: ${DIST}`);
