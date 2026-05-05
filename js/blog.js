import { state } from "./state.js";
import { closeWindow, openWindow } from "./window-manager.js";

const elements = {
  list: document.getElementById("notes-list-container"),
  modal: document.getElementById("blog-reader-modal"),
  content: document.getElementById("markdown-content"),
  title: document.getElementById("reader-title"),
  prev: document.getElementById("prev-post-btn"),
  next: document.getElementById("next-post-btn"),
};

const renderer = {
  image({ href, title, text }) {
    if (href.startsWith("http") || href.startsWith("https")) {
      return `<img src="${href}" alt="${text}" title="${title || ""}" style="max-width:100%; height:auto; display:block; margin: 1.5rem auto; border-radius:4px;">`;
    }

    const cleanHref = href.replace(/^\//, "");
    return `<img src="posts/${cleanHref}" alt="${text}" title="${title || ""}" style="max-width:100%; height:auto; display:block; margin: 1.5rem auto; border-radius:4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">`;
  },
};

marked.use({ renderer });

export async function initBlog() {
  try {
    const res = await fetch("/posts/manifest.json");
    if (!res.ok) throw new Error("No manifest found");
    state.posts = await res.json();
    renderList();
  } catch (err) {
    console.error(err);
    elements.list.innerHTML =
      "<li>Error loading posts. Run build-posts.js!</li>";
  }

  elements.prev.addEventListener("click", () => navigate(-1));
  elements.next.addEventListener("click", () => navigate(1));
}

function renderList() {
  elements.list.innerHTML = state.posts
    .map(
      (post, index) => `
        <li class="note-item" data-index="${index}">
            <span class="note-title">${post.title}</span>
            <span class="note-date">${post.date}</span>
        </li>
    `,
    )
    .join("");

  document.querySelectorAll(".note-item").forEach((item) => {
    item.addEventListener("click", () => {
      loadPost(parseInt(item.dataset.index));
    });
  });
}

async function loadPost(index) {
  if (index < 0 || index >= state.posts.length) return;

  state.currentPostIndex = index;
  const post = state.posts[index];

  closeWindow("notes");
  openWindow("blog-reader");

  elements.title.textContent = post.filename;
  elements.content.innerHTML = "<p>Loading...</p>";
  updateControls();

  try {
    const res = await fetch(`/posts/${post.filename}`);
    if (!res.ok) throw new Error("Post file missing");
    const text = await res.text();

    const cleanText = text.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---/, "");

    const htmlContent = `
            <div style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                gap: 20px; 
                flex-wrap: wrap;
                margin-bottom: 2rem; 
                border-bottom: 1px solid var(--border-light); 
                padding-bottom: 1rem;
            ">
                <h1 style="
                    margin: 0; 
                    font-size: 1.8rem; 
                    line-height: 1.2; 
                    border-bottom: none; 
                    padding-bottom: 0;
                ">
                    ${post.title}
                </h1>
                
                <div style="
                    flex-shrink: 0;
                    background: var(--surface-light); 
                    padding: 4px 12px; 
                    border-radius: 20px; 
                    border: 1px solid var(--border-light);
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-family: var(--font-mono);
                ">
                    📅 ${post.date}
                </div>
            </div>
            <div class="markdown-rendered">
                ${marked.parse(cleanText)}
            </div>
        `;

    elements.content.innerHTML = htmlContent;
    elements.content
      .querySelectorAll("pre code")
      .forEach((el) => hljs.highlightElement(el));
  } catch (err) {
    console.error(err);
    elements.content.innerHTML = "<p>Error loading content.</p>";
  }
}

function updateControls() {
  elements.prev.disabled = state.currentPostIndex <= 0;
  elements.next.disabled = state.currentPostIndex >= state.posts.length - 1;
}

function navigate(direction) {
  const newIndex = state.currentPostIndex + direction;
  if (newIndex >= 0 && newIndex < state.posts.length) {
    loadPost(newIndex);
  }
}
