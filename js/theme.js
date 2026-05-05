import { state } from "./state.js";

const elements = {
  toggle: document.getElementById("theme-toggle"),
  moon: document.getElementById("moon-icon"),
  sun: document.getElementById("sun-icon"),
};

export function initTheme() {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const savedTheme = localStorage.getItem("theme") || systemTheme;
  setTheme(savedTheme);

  elements.toggle.addEventListener("click", toggleTheme);
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);

  // Swap highlight.js stylesheet
  const hlTheme = document.getElementById("hljs-theme");
  if (hlTheme) {
    hlTheme.href =
      theme === "dark"
        ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css";
  }

  document.querySelectorAll("pre code").forEach((el) => {
    delete el.dataset.highlighted;
    hljs.highlightElement(el);
  });

  if (theme === "dark") {
    elements.moon.classList.add("hidden");
    elements.sun.classList.remove("hidden");
  } else {
    elements.moon.classList.remove("hidden");
    elements.sun.classList.add("hidden");
  }
}

function toggleTheme() {
  const newTheme = state.theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  elements.toggle.blur();
}
