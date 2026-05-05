export const state = {
  openWindows: [],
  windowZIndices: {},
  highestZIndex: 50,
  screenSize: "desktop",
  theme: "light",
  windowPositions: {},
  posts: [],
  currentPostIndex: -1,
  dragState: {
    isDragging: false,
    currentWindow: null,
    offsetX: 0,
    offsetY: 0,
  },
};
