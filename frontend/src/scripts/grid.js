const canvas = document.getElementById("grid-canvas");
const ctx = canvas.getContext("2d");

let width, height, mouseX, mouseY, cols, rows;
const spacing = 50;
const maxDistance = 220;
const NEON_RGB = "0, 240, 255";
const TEXT_DAMPING = 0.15;

let textMask = new Uint8Array(0);
let recomputeScheduled = false;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  cols = Math.floor(width / spacing) + 1;
  rows = Math.floor(height / spacing) + 1;
  scheduleTextMaskRecompute();
}

function isTextNode(node) {
  return node.textContent.trim().length > 0;
}

function collectTextRects() {
  const rects = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => (isTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
  });

  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    if (parent && parent.tagName !== "SCRIPT" && parent.tagName !== "STYLE") {
      const range = document.createRange();
      range.selectNodeContents(node);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        rects.push(rect);
      }
    }
    node = walker.nextNode();
  }

  return rects;
}

function recomputeTextMask() {
  recomputeScheduled = false;
  if (!cols || !rows) return;

  const mask = new Uint8Array(cols * rows);
  const padding = spacing * 0.6;

  collectTextRects().forEach((rect) => {
    const iStart = Math.max(0, Math.floor((rect.left - padding) / spacing));
    const iEnd = Math.min(cols - 1, Math.ceil((rect.right + padding) / spacing));
    const jStart = Math.max(0, Math.floor((rect.top - padding) / spacing));
    const jEnd = Math.min(rows - 1, Math.ceil((rect.bottom + padding) / spacing));

    for (let j = jStart; j <= jEnd; j++) {
      const rowOffset = j * cols;
      for (let i = iStart; i <= iEnd; i++) {
        mask[rowOffset + i] = 1;
      }
    }
  });

  textMask = mask;
}

function scheduleTextMaskRecompute() {
  if (recomputeScheduled) return;
  recomputeScheduled = true;
  requestAnimationFrame(recomputeTextMask);
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  let j = 0;
  for (let y = 0; y <= height; y += spacing, j++) {
    let i = 0;
    for (let x = 0; x <= width; x += spacing, i++) {
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let influence = Math.max(0, 1 - dist / maxDistance) ** 1.5;

      if (textMask[j * cols + i]) {
        influence *= TEXT_DAMPING;
      }

      const size = 1.3 + influence * 3.5;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);

      if (influence > 0.03) {
        ctx.shadowBlur = 22 * influence;
        ctx.shadowColor = `rgba(${NEON_RGB}, ${Math.min(influence * 1.3, 1)})`;
        ctx.fillStyle = `rgba(${NEON_RGB}, ${0.08 + influence * 0.92})`;
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      }

      ctx.fill();
    }
  }

  ctx.shadowBlur = 0;
  requestAnimationFrame(draw);
}

resize();
mouseX = width / 2;
mouseY = height / 2;

window.addEventListener("resize", resize);
window.addEventListener("scroll", scheduleTextMaskRecompute, { passive: true });
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const contentObserver = new MutationObserver(scheduleTextMaskRecompute);
contentObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

draw();
