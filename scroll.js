// Scroll effects:
// - the big name shrinks away and a small bar with the name drops in
// - the bar shows which section you are reading, and that section's label darkens
// - each section's rule is drawn by the scroll as the section comes up
// - entries rise into place as they come on screen

const sections = [...document.querySelectorAll("section")];
const name = document.querySelector("header h1");
const bar = document.getElementById("bar");
const barSection = document.getElementById("bar-section");

function update() {
  const vh = window.innerHeight;
  const readLine = vh * 0.35;
  const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 2;

  // offsetTop ignores the transform applied below, so this does not feed back on itself
  const nameBottom = name.offsetTop + name.offsetHeight;
  const leave = Math.min(window.scrollY / nameBottom, 1);
  name.style.setProperty("--leave", leave.toFixed(3));
  bar.classList.toggle("shown", window.scrollY > nameBottom - bar.offsetHeight);

  let currentLabel = "";
  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    // 0 when the section's top enters at the bottom, 1 by the time it is 40% up
    const drawn = Math.min(Math.max((vh - r.top) / (vh * 0.4), 0), 1);
    s.style.setProperty("--drawn", drawn.toFixed(3));
    // the last section can be too short to reach the read line, so it wins at the bottom
    const current = atBottom ? i === sections.length - 1 : r.top < readLine && r.bottom > readLine;
    s.classList.toggle("current", current);
    if (current) currentLabel = s.querySelector("h2").textContent;
  });

  if (barSection.textContent !== currentLabel) {
    barSection.textContent = currentLabel;
    barSection.classList.remove("swap");
    void barSection.offsetWidth; // restart the animation
    barSection.classList.add("swap");
  }
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

const risers = document.querySelectorAll(".entry, .plain li, .also");
risers.forEach((el) => el.classList.add("rise"));

const observer = new IntersectionObserver(
  (entries) => {
    // items that arrive together go one after another, 50ms apart
    entries.filter((e) => e.isIntersecting).forEach((e, i) => {
      e.target.style.transitionDelay = Math.min(i, 3) * 50 + "ms";
      e.target.classList.add("in");
      observer.unobserve(e.target);
    });
  },
  { rootMargin: "0px 0px -5% 0px" }
);

risers.forEach((el) => observer.observe(el));
