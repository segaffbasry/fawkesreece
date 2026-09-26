// Splits a text block into masked lines so each line can slide up out of its own mask. The original markup is
// restored once the reveal has played, so resizing afterwards reflows as normal text.
export function splitLines(root: HTMLElement) {
  const original = root.innerHTML;
  const words = (root.textContent ?? "").trim().split(/\s+/);
  root.innerHTML = words.map((word) => `<span class="sw">${escape(word)}</span>`).join(" ");
  const spans = Array.from(root.querySelectorAll<HTMLElement>(".sw"));
  const lines: string[][] = [];
  let top = -1;
  spans.forEach((span) => {
    if (span.offsetTop !== top) { lines.push([]); top = span.offsetTop; }
    lines[lines.length - 1].push(span.textContent ?? "");
  });
  root.innerHTML = lines.map((line) => `<span class="ln"><span class="li">${line.map(escape).join(" ")}</span></span>`).join(" ");
  return { lines: Array.from(root.querySelectorAll<HTMLElement>(".li")), revert: () => { root.innerHTML = original; } };
}

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
