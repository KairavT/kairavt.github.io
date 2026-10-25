// Fades each block in as it scrolls into view. Blocks that share a parent
// come in one after another instead of all at once.

const targets = document.querySelectorAll(
  "header > *, section > h2, .entry, .plain li, .also, footer"
);

const set = new Set(targets);

targets.forEach((el) => {
  el.classList.add("reveal");
  const siblings = [...el.parentElement.children].filter((c) => set.has(c));
  el.style.transitionDelay = Math.min(siblings.indexOf(el), 4) * 80 + "ms";
});

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    }
  },
  { rootMargin: "0px 0px -8% 0px" }
);

targets.forEach((el) => observer.observe(el));
document.querySelectorAll("section").forEach((el) => observer.observe(el));
