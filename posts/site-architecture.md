---
title: Engineering this Portfolio Site
date: Jan 15
---

# It's Not Just HTML & CSS

While my primary focus is IT Infrastructure, I built this "Desktop Simulator" portfolio to practice interacting with the DOM and managing state—skills that translate directly to troubleshooting web applications.

## The Window Manager Logic

The core of this site is a custom **Window Manager** (`window-manager.js`). It mimics an Operating System by handling:

1. **Z-Index Stacking:** Clicking a window brings it to the "front" by dynamically incrementing a global `highestZIndex` counter.
2. **State Management:** I use a central `state` object to track which windows are open, their coordinates, and the current theme.

## Fetching Data (The Blog)

This "Notes" app you are reading right now isn't hardcoded HTML. It's a dynamic loader.

1. **The Backend:** A Node.js script (`build-posts.js`) scans a folder of Markdown files.
2. **The API:** It generates a `manifest.json` file.
3. **The Frontend:** When you open this app, JavaScript fetches that manifest, and then fetches the raw Markdown file for the selected post.
4. **Rendering:** It uses a parsing library to convert that Markdown text into the HTML you see here.

## Why This Matters for IT

Building this taught me about **HTTP Request/Response cycles**, **JSON parsing errors**, and **Client-Side rendering**. When a user says "The web app is broken," I now have a deeper understanding of what might be failing under the hood—whether it's a missing asset (404), a syntax error in the JSON, or a caching issue.
