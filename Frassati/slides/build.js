const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const MEETING_NOTES = path.join(ROOT, 'Meeting Notes');
const ATTACHMENTS = path.join(ROOT, '..', 'Attachments');
const DIST = path.join(__dirname, 'dist');
const SLIDES_DIR = path.join(DIST, 'slides');
const DIST_ATTACHMENTS = path.join(DIST, 'Attachments');

// Ensure output dirs exist
if (!fs.existsSync(SLIDES_DIR)) {
  fs.mkdirSync(SLIDES_DIR, { recursive: true });
}
if (fs.existsSync(ATTACHMENTS) && !fs.existsSync(DIST_ATTACHMENTS)) {
  fs.mkdirSync(DIST_ATTACHMENTS, { recursive: true });
}

// Copy Attachments into dist so slides can reference ../Attachments/
if (fs.existsSync(ATTACHMENTS)) {
  for (const name of fs.readdirSync(ATTACHMENTS)) {
    const src = path.join(ATTACHMENTS, name);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, path.join(DIST_ATTACHMENTS, name));
    }
  }
  console.log('Copied Attachments to dist/Attachments');
}

const mdFiles = fs.readdirSync(MEETING_NOTES).filter((f) => f.endsWith('.md'));

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parseDateFromFile(base, year) {
  const match = base.match(/^(\w+)\s+(\d+)/);
  if (!match || !year) return { year: 9999, month: 12, day: 31 };
  const monthName = match[1];
  const month = MONTH_NAMES.indexOf(monthName) + 1;
  const day = parseInt(match[2], 10) || 1;
  return { year: parseInt(year, 10), month: month || 12, day: day || 1 };
}

function dateLabel(base, year) {
  const match = base.match(/^(\w+\s+\d+(?:st|nd|rd|th)?)/);
  if (match && year) return `${match[1]}, ${year}`;
  return year || base;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

const TITLE_PROMPT = `You are given the start of a slide deck (meeting notes). Suggest a very short, descriptive title for this deck in 3–8 words. The title should capture the main topic or theme. Reply with only the title, no quotes, no period, no explanation.`;

async function generateTitleWithGemini(content) {
  const excerpt = content.replace(/\n---\r?\n/g, '\n\n').slice(0, 2800);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${TITLE_PROMPT}\n\n---\n\n${excerpt}` }] }],
      generationConfig: { maxOutputTokens: 30, temperature: 0.3 },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini title request failed: ${res.status} ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!raw || raw.length === 0 || raw.length >= 80) {
    throw new Error('Gemini returned an invalid or empty title');
  }
  return raw;
}

async function generateTitle(content, firstHeading) {
  if (GEMINI_API_KEY) return generateTitleWithGemini(content);
  return firstHeading;
}

const REVEAL_CSS = 'https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css';
const REVEAL_JS = 'https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js';
const REVEAL_THEME = 'https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/serif.css';

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const body = match ? content.slice(match[0].length) : content;
  let year = null;
  if (match) {
    const fm = match[1];
    const modified = fm.match(/date modified:\s*[^\n]*\b(20\d{2})\b/);
    const created = fm.match(/date created:\s*[^\n]*\b(20\d{2})\b/);
    year = (modified && modified[1]) || (created && created[1]) || null;
  }
  return { body, year };
}

// Convert Obsidian wiki-style images ![[file|width]] or ![[file]] to HTML so width is preserved
function obsidianImagesToMarkdown(text) {
  return text
    .replace(/!\[\[([^\]|]+)\|(\d+)\]\]/g, '<img src="../Attachments/$1" width="$2" alt="">')
    .replace(/!\[\[([^\]]+)\]\]/g, '<img src="../Attachments/$1" alt="">');
}

function sectionToHtml(sectionMarkdown) {
  const withImages = obsidianImagesToMarkdown(sectionMarkdown.trim());
  return marked.parse(withImages, { gfm: true });
}

function slugify(base) {
  return base.replace(/\s+/g, '-').replace(/[^\w\-.]/g, '');
}

const usedSlugs = new Set();
function uniqueSlug(base) {
  let slug = slugify(base) || 'slide';
  let candidate = slug;
  let n = 0;
  while (usedSlugs.has(candidate)) candidate = `${slug}-${++n}`;
  usedSlugs.add(candidate);
  return candidate;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildRevealHtml(title, sections) {
  const sectionsHtml = sections
    .map((html) => `<section>${html}</section>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="${REVEAL_CSS}" />
  <link rel="stylesheet" href="${REVEAL_THEME}" />
  <style>
    .reveal .slides { text-align: left; }
    .reveal .slides section { text-align: left; }
    .reveal section img { background: none; border: none; box-shadow: none; max-height: 70vh; }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
${sectionsHtml}
    </div>
  </div>
  <script src="${REVEAL_JS}"></script>
  <script>
    Reveal.initialize({
      hash: true,
      transition: 'slide',
      pdfSeparateFragments: false
    });
  </script>
</body>
</html>`;
}

const manifest = [];

async function build() {
  if (GEMINI_API_KEY) console.log('Using Gemini to generate card titles…');

  for (const file of mdFiles) {
    const base = path.basename(file, '.md');
    const safeSlug = uniqueSlug(base);
    const mdPath = path.join(MEETING_NOTES, file);
    const outPath = path.join(SLIDES_DIR, `${safeSlug}.html`);

    let title = base;
    let content;
    let year = null;
    try {
      content = fs.readFileSync(mdPath, 'utf8');
      const { body: withTitle, year: fmYear } = parseFrontmatter(content);
      year = fmYear;
      const firstHeading = withTitle.match(/^#+\s+(.+)$/m);
      if (firstHeading) title = firstHeading[1].trim();
      content = withTitle;
    } catch (err) {
      console.error(`Read failed for ${file}:`, err.message);
      continue;
    }

    title = await generateTitle(content, title);

    const titleWithYear = year ? `${title} (${year})` : title;
    const displayDate = dateLabel(base, year);

    const sections = content
      .split(/\n---\r?\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map(sectionToHtml);

    if (sections.length === 0) {
      sections.push('<p>No content.</p>');
    }

    const html = buildRevealHtml(titleWithYear, sections);
    fs.writeFileSync(outPath, html, 'utf8');
    const dateSort = parseDateFromFile(base, year);
    manifest.push({ title, slug: safeSlug, file: base, date: displayDate, year: year || null, _sort: dateSort });
  }

  manifest.sort((a, b) => {
    const sa = a._sort;
    const sb = b._sort;
    if (sa.year !== sb.year) return sa.year - sb.year;
    if (sa.month !== sb.month) return sa.month - sb.month;
    return sa.day - sb.day;
  });
  manifest.forEach((m) => delete m._sort);

  fs.writeFileSync(
    path.join(DIST, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml);

  console.log(`Built ${manifest.length} slides with reveal.js. Output: ${DIST}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
