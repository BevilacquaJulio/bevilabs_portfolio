const canvas = document.getElementById("grid-canvas");
const ctx = canvas.getContext("2d");

let width, height, mouseX, mouseY;
const spacing = 50;
const maxDistance = 150;

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
      const influence = Math.max(0, 1 - dist / maxDistance);
      const alpha = 0.04 + influence * 0.12;
      const size = 1.5 + influence * 2;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      if (influence > 0.1) {
        ctx.beginPath();
        ctx.arc(x, y, size + 4 * influence, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${influence * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

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
