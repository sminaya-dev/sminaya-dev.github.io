import { initBlog } from "./blog.js";
import { state } from "./state.js";
import { initTheme } from "./theme.js";
import {
  bringToFront,
  closeAllWindows,
  initWindowManager,
  resetStylesForMobile,
} from "./window-manager.js";

// Screen Size Logic
function updateScreenSize() {
  const width = window.innerWidth;
  const newSize = width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";
  const oldSize = state.screenSize;

  state.screenSize = newSize;

  if (newSize !== "desktop") {
    resetStylesForMobile();

    if (oldSize === "desktop" || oldSize === "tablet") {
      closeAllWindows();
    }
  }
}

function initDrag() {
  let currentModal = null;

  document.addEventListener("mousedown", (e) => {
    const header = e.target.closest(".draggable-header");
    if (!header) return;

    if (header.classList.contains("no-drag")) return;

    if (e.target.closest("button")) return;

    const modal = header.closest(".modal-window");

    if (modal) {
      bringToFront(modal.dataset.id);
    }

    if (modal && state.screenSize === "desktop") {
      state.dragState.isDragging = true;
      currentModal = modal;
      const rect = modal.getBoundingClientRect();
      state.dragState.offsetX = e.clientX - rect.left;
      state.dragState.offsetY = e.clientY - rect.top;
      e.preventDefault();
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!state.dragState.isDragging || !currentModal) return;

    const x = e.clientX - state.dragState.offsetX;
    const y = e.clientY - state.dragState.offsetY;

    const maxX = window.innerWidth - currentModal.offsetWidth;
    const maxY = window.innerHeight - currentModal.offsetHeight;

    currentModal.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    currentModal.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    currentModal.style.transform = "none";
  });

  document.addEventListener("mouseup", () => {
    if (state.dragState.isDragging && currentModal) {
      state.windowPositions[currentModal.dataset.id] = {
        x: currentModal.style.left,
        y: currentModal.style.top,
      };
    }
    state.dragState.isDragging = false;
    currentModal = null;
  });
}

function init() {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);

  initTheme();
  initWindowManager();
  initDrag();
  initBlog();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
