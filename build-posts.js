const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "posts");
const OUTPUT_FILE = path.join(__dirname, "posts", "manifest.json");

if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR);
}

function parseFrontMatter(content) {
  const match = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);

  if (match) {
    const metaBlock = match[1];
    const titleMatch = metaBlock.match(/title:\s*(.+)/);
    const dateMatch = metaBlock.match(/date:\s*(.+)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : "Untitled",
      date: dateMatch ? dateMatch[1].trim() : "No Date",
    };
  }
  return { title: "Untitled", date: "No Date" };
}

const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".md"));
const manifest = [];

files.forEach((file) => {
  const content = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
  const meta = parseFrontMatter(content);

  manifest.push({
    id: file.replace(".md", ""),
    filename: file,
    title: meta.title,
    date: meta.date,
  });
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
console.log(`✅ Generated manifest.json with ${manifest.length} posts.`);
