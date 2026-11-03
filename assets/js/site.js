// Command palette (Ctrl+K) and the hidden achievements layer.
// Project cards live in index.html; this script reads them from the page.

const $ = (id) => document.getElementById(id);
const RESUME = "Keith_Francis_Resume.pdf";

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

const PROJECTS = [...document.querySelectorAll(".proj")].map(el => ({
  id: el.dataset.id,
  name: el.querySelector("h3").textContent,
  kind: el.querySelector(".kind").textContent,
  el
}));

const ACH = [
  { id: "palette", name: "Hello, terminal", hint: "Open the command palette." },
  { id: "tour", name: "Full stack tour", hint: "Open the details of every project." },
  { id: "process", name: "Reads the docs", hint: "Visit How I build with AI." },
  { id: "ask", name: "Curious mind", hint: "Ask the palette a question in plain words." },
  { id: "theme", name: "Night shift", hint: "Switch the theme from the palette." },
  { id: "email", name: "Let's talk", hint: "Copy the email address." },
  { id: "sudo", name: "Root access", hint: "There's a command the help list doesn't show." },
  { id: "konami", name: "Up, up, down, down", hint: "A very old cheat code." }
];

// Achievements

const got = new Set(store.get("ach", []));
const opened = new Set();
let toastTimer;

function renderTrophies() {
  $("trophyCount").textContent = got.size + "/" + ACH.length;
  $("tSummary").textContent = got.size + " of " + ACH.length + " unlocked";
  $("tMeter").style.width = (got.size / ACH.length * 100) + "%";
  $("tList").innerHTML = ACH.map(a => {
    const has = got.has(a.id);
    return `<li class="${has ? "got" : ""}"><span class="badge" aria-hidden="true">${has ? "★" : "?"}</span><div><b>${has ? a.name : "Locked"}</b><small>${a.hint}</small></div></li>`;
  }).join("");
}

function unlock(id) {
  if (got.has(id)) return;
  got.add(id);
  store.set("ach", [...got]);
  renderTrophies();
  $("toastName").textContent = ACH.find(a => a.id === id).name;
  $("toast").classList.remove("hide");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.add("hide"), 3200);
}

// Projects

const smooth = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

PROJECTS.forEach(p => {
  const d = p.el.querySelector("details");
  d.addEventListener("toggle", () => {
    p.el.classList.toggle("open", d.open);
    if (d.open) { opened.add(p.id); if (opened.size === PROJECTS.length) unlock("tour"); }
  });
});

function openProject(p) {
  p.el.querySelector("details").open = true;
  p.el.scrollIntoView({ behavior: smooth(), block: "center" });
}

function go(hash) {
  closeAll();
  document.querySelector(hash).scrollIntoView({ behavior: smooth() });
}

// Theme

function currentTheme() {
  return document.documentElement.dataset.theme
    || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  store.set("theme", next);
  return next;
}

// Command palette

const ANSWERS = [
  [/stack|tech|language|framework/, "Mostly TypeScript: React, Vue and Next.js on the front end, Node with Express or Fastify behind it, Electron for desktop apps, and C++ for Unreal plugins. See the Skills section."],
  [/rag|retriev|embed|search/, "DocStew does retrieval-augmented Q&A over your own documents, using an embedding index I built from scratch plus full-text search, all running locally."],
  [/local|ollama|offline|privacy|private/, "Local first. Job Explorer and DocStew run models through Ollama on your own machine, and cloud models are opt-in with your own API key."],
  [/capital|bank|reliab|failover|resilien/, "At Capital One I owned failover testing for a platform: pass rate from 50% to 100%, and a 5-minute Platinum isolation rating. Run: open experience"],
  [/marine|veteran|military|clearance/, "12 years in the Marine Corps: 8 as an avionics calibration technician and 4 as a Lean Six Sigma instructor. I previously held a Top Secret clearance."],
  [/mcp|agent|tool/, "AIWorldBuilder is an MCP toolset for Unreal Engine: agents call it to create landscapes, run PCG and capture screenshots of their work. Try: open aiworldbuilder"],
  [/test|quality|verify/, "Every phase ships with tests: unit tests, Playwright end-to-end runs and axe accessibility scans, then a hand check of the real app."],
  [/hire|available|job|role|work/, "Yes. I'm looking for AI Engineer roles. Run: contact"],
  [/game|unreal|wow/, "Games are my longer-term goal. AIWorldBuilder and the WoW addons are where I practise."],
  [/who|about|you/, "Keith Francis: full-stack engineer, Marine Corps veteran, and builder of AI apps from local-model desktop tools to MCP plugins for game engines."]
];
const WHOAMI = ANSWERS[ANSWERS.length - 1][1];

const COMMANDS = [
  { name: "help", desc: "List commands", run: () => say("projects · open <name> · resume · contact · theme · achievements · whoami · clear\nOr type a question in plain words.") },
  { name: "projects", desc: "Jump to projects", run: () => go("#projects") },
  ...PROJECTS.map(p => ({ name: "open " + p.name.toLowerCase().replace(/\s+/g, ""), desc: p.kind, run: () => { closeAll(); openProject(p); } })),
  { name: "process", desc: "How I build with AI", run: () => go("#process") },
  { name: "open experience", desc: "Work history", run: () => go("#experience") },
  { name: "resume", desc: "Open the résumé PDF", run: () => { window.open(RESUME, "_blank", "noopener"); say("Opening the résumé PDF in a new tab.", true); } },
  { name: "contact", desc: "Jump to contact", run: () => go("#contact") },
  { name: "theme", desc: "Switch light / dark", run: () => { say("Theme set to " + toggleTheme() + ".", true); unlock("theme"); } },
  { name: "achievements", desc: "Open the trophy case", run: () => { closeAll(); openTrophies(); } },
  { name: "whoami", desc: "Short bio", run: () => say(WHOAMI) },
  { name: "clear", desc: "Clear output", run: () => { $("pOut").innerHTML = ""; } }
];

const SECRET = {
  "sudo hire-me": () => { say("[sudo] access granted.\nOffer letter template loaded. Please send it to the email in Contact.", true); unlock("sudo"); },
  "semper fi": () => say("Oorah. 2002–2014, Sergeant (E-5).", true)
};

let sel = 0, shown = [], lastFocus = null;

function line(text, cls) {
  const div = document.createElement("div");
  div.className = "line" + (cls ? " " + cls : "");
  div.textContent = text;
  $("pOut").appendChild(div);
  $("pOut").scrollTop = $("pOut").scrollHeight;
}
const say = (text, ok) => line(text, ok ? "ok" : "");
const echo = (text) => line("> " + text, "cmd");

function renderList() {
  const q = $("pInput").value.trim().toLowerCase();
  shown = COMMANDS.filter(c => !q || c.name.includes(q));
  if (sel >= shown.length) sel = 0;
  $("pList").innerHTML = shown.map((c, i) =>
    `<li role="option" aria-selected="${i === sel}" class="${i === sel ? "sel" : ""}" data-i="${i}"><span>${c.name}</span><span>${c.desc}</span></li>`
  ).join("");
}

function run(c) { echo(c.name); c.run(); renderList(); }

function runInput() {
  const raw = $("pInput").value.trim();
  const q = raw.toLowerCase();
  $("pInput").value = "";
  if (SECRET[q]) { echo(raw); SECRET[q](); renderList(); return; }
  const pick = COMMANDS.find(c => c.name === q) || shown[sel];
  if (pick) { run(pick); return; }
  if (!q) return;
  echo(raw);
  const hit = ANSWERS.find(([re]) => re.test(q));
  say(hit ? hit[1] : "I don't have an answer for that one. Try: help");
  unlock("ask");
  renderList();
}

function openPalette() {
  lastFocus = document.activeElement;
  $("paletteOverlay").hidden = false;
  sel = 0;
  renderList();
  $("pInput").focus();
  unlock("palette");
}

function openTrophies() {
  if (!lastFocus) lastFocus = document.activeElement;
  renderTrophies();
  $("trophyOverlay").hidden = false;
  $("closeTrophies").focus();
}

function closeAll() {
  const wasOpen = !$("paletteOverlay").hidden || !$("trophyOverlay").hidden;
  $("paletteOverlay").hidden = true;
  $("trophyOverlay").hidden = true;
  if (wasOpen && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  lastFocus = null;
}

$("openPalette").addEventListener("click", openPalette);
$("teaser").addEventListener("click", openPalette);
$("openTrophies").addEventListener("click", openTrophies);
$("closeTrophies").addEventListener("click", closeAll);
["paletteOverlay", "trophyOverlay"].forEach(id =>
  $(id).addEventListener("click", e => { if (e.target.id === id) closeAll(); })
);
$("pInput").addEventListener("input", () => { sel = 0; renderList(); });
$("pInput").addEventListener("keydown", e => {
  if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); renderList(); }
  else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); renderList(); }
  else if (e.key === "Enter") { e.preventDefault(); runInput(); }
});
$("pList").addEventListener("click", e => {
  const li = e.target.closest("li");
  if (li) run(shown[+li.dataset.i]);
});

// Contact

$("copyEmail").addEventListener("click", async () => {
  const text = $("email").textContent;
  try {
    await navigator.clipboard.writeText(text);
    $("copyEmail").textContent = "Copied";
  } catch {
    const r = document.createRange();
    r.selectNodeContents($("email"));
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
    $("copyEmail").textContent = "Selected, press Ctrl+C";
  }
  unlock("email");
});

// Keyboard: Ctrl+K, Escape and the Konami code

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let kpos = 0;
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    $("paletteOverlay").hidden ? openPalette() : closeAll();
    return;
  }
  if (e.key === "Escape") { closeAll(); return; }
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kpos = k === KONAMI[kpos] ? kpos + 1 : (k === KONAMI[0] ? 1 : 0);
  if (kpos === KONAMI.length) { kpos = 0; unlock("konami"); }
});

new IntersectionObserver((entries, obs) => {
  if (entries.some(en => en.isIntersecting)) { unlock("process"); obs.disconnect(); }
}, { threshold: 0.6 }).observe($("process").querySelector(".steps"));

renderTrophies();
