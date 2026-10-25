// Draws each section's rule as the section scrolls up the screen, and marks
// the section being read so its label darkens.

const sections = [...document.querySelectorAll("section")];

function update() {
  const vh = window.innerHeight;
  const readLine = vh * 0.35;
  const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 2;

  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    // 0 when the section's top enters at the bottom, 1 by the time it is 40% up
    const drawn = Math.min(Math.max((vh - r.top) / (vh * 0.4), 0), 1);
    s.style.setProperty("--drawn", drawn.toFixed(3));
    // the last section can be too short to reach the read line, so it wins at the bottom
    const current = atBottom ? i === sections.length - 1 : r.top < readLine && r.bottom > readLine;
    s.classList.toggle("current", current);
  });
}

let queued = false;
function onScroll() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; update(); });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
update();
