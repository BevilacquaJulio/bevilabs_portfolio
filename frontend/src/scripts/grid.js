const canvas = document.getElementById("grid-canvas");
const ctx = canvas.getContext("2d");

let width, height, mouseX, mouseY;
const spacing = 50;
const maxDistance = 220;
const NEON_RGB = "0, 240, 255";

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (let x = 0; x <= width; x += spacing) {
    for (let y = 0; y <= height; y += spacing) {
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / maxDistance) ** 1.5;
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
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

draw();
