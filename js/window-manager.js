import { state } from "./state.js";

const backdrop = document.getElementById("backdrop");

export function initWindowManager() {
  document.addEventListener("click", (e) => {
    if (state.screenSize !== "desktop" || state.openWindows.length === 0)
      return;

    const clickedModal = e.target.closest(".modal-window");
    const clickedIcon = e.target.closest(".desktop-icon");
    const clickedTheme = e.target.closest("#theme-toggle");

    if (!clickedModal && !clickedIcon && !clickedTheme) {
      closeAllWindows();
    }
  });

  backdrop.addEventListener("click", closeAllWindows);

  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal-window");
      if (modal) closeWindow(modal.dataset.id);
    });
  });

  document.querySelectorAll(".desktop-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      const id = icon.dataset.window;
      if (id) toggleWindow(id);
    });
  });

  document.querySelectorAll(".modal-window").forEach((modal) => {
    modal.addEventListener("click", () => bringToFront(modal.dataset.id));
  });
}

export function toggleWindow(windowId) {
  if (state.openWindows.includes(windowId)) {
    closeWindow(windowId);
  } else {
    openWindow(windowId);
  }
}

export function openWindow(windowId) {
  const modal = document.getElementById(`${windowId}-modal`);
  if (!modal) return;

  if (state.screenSize === "mobile") {
    closeAllWindows();
  }

  if (!state.openWindows.includes(windowId)) {
    state.openWindows.push(windowId);
  }

  if (
    state.screenSize === "desktop" &&
    !modal.classList.contains("static-modal")
  ) {
    if (state.windowPositions[windowId]) {
      const pos = state.windowPositions[windowId];
      modal.style.left = pos.x;
      modal.style.top = pos.y;
    } else {
      const mainWindow = document.querySelector(".main-window-container");
      const mainRect = mainWindow.getBoundingClientRect();

      const initialPositions = {
        skills: { x: mainRect.left - 150, y: mainRect.top - 50 },
        projects: { x: mainRect.right - 350, y: mainRect.top - 20 },
        notes: { x: mainRect.left - 100, y: mainRect.bottom - 280 },
        contact: { x: mainRect.right - 300, y: mainRect.bottom - 250 },
      };

      const defaultPos = { x: mainRect.left + 50, y: mainRect.top + 50 };
      const targetPos = initialPositions[windowId] || defaultPos;

      const newX = Math.max(
        0,
        Math.min(targetPos.x, window.innerWidth - modal.offsetWidth),
      );
      const newY = Math.max(
        0,
        Math.min(targetPos.y, window.innerHeight - modal.offsetHeight),
      );

      modal.style.left = `${newX}px`;
      modal.style.top = `${newY}px`;

      state.windowPositions[windowId] = {
        x: modal.style.left,
        y: modal.style.top,
      };
    }
  }

  bringToFront(windowId);
  modal.classList.remove("hidden");
  updateBackdrop();
}

export function closeWindow(windowId) {
  const modal = document.getElementById(`${windowId}-modal`);
  if (modal) modal.classList.add("hidden");
  state.openWindows = state.openWindows.filter((id) => id !== windowId);
  updateBackdrop();
}

export function closeAllWindows() {
  state.openWindows.forEach((id) => {
    const modal = document.getElementById(`${id}-modal`);
    if (modal) modal.classList.add("hidden");
  });
  state.openWindows = [];
  updateBackdrop();
}

export function resetStylesForMobile() {
  const modals = document.querySelectorAll(".modal-window");
  modals.forEach((modal) => {
    modal.style.left = "";
    modal.style.top = "";
    modal.style.transform = "";
  });
}

export function bringToFront(windowId) {
  state.highestZIndex++;
  state.windowZIndices[windowId] = state.highestZIndex;
  const modal = document.getElementById(`${windowId}-modal`);
  if (modal) modal.style.zIndex = state.highestZIndex;
}

function updateBackdrop() {
  const shouldShow =
    state.openWindows.length > 0 && state.screenSize !== "desktop";
  backdrop.classList.toggle("hidden", !shouldShow);
}
