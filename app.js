(() => {
const $ = s => document.querySelector(s);
const API = "https://naf-ai-backend.vercel.app/api/chat";
const KEY = "naf-ai-chat-v3";
const feed = $("#feed"), input = $("#input"), send = $("#send"), composer = $("#composer");
let msgs = [], busy = false;
try { msgs = JSON.parse(localStorage.getItem(KEY)) || []; } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(msgs.slice(-40))); } catch {} };

const esc = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function md(t) {
  const blocks = [];
  t = esc(t).replace(/```\w*\n?([\s\S]*?)```/g, (_, c) => {
    blocks.push(`<pre><code>${c.trim()}</code></pre>`);
    return `\u0000${blocks.length - 1}\u0000`;
  });
  t = t.replace(/`([^`\n]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.split(/\n{2,}/).map(p => {
    if (/^\s*[-*] /.test(p)) return "<ul>" + p.split("\n").map(l => `<li>${l.replace(/^\s*[-*] /, "")}</li>`).join("") + "</ul>";
    if (/^\s*\d+\. /.test(p)) return "<ol>" + p.split("\n").map(l => `<li>${l.replace(/^\s*\d+\. /, "")}</li>`).join("") + "</ol>";
    return `<p>${p.replace(/\n/g, "<br>")}</p>`;
  }).join("");
  return t.replace(/<p>(\u0000\d+\u0000)<\/p>/g, "$1").replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[i]);
}
function tool(label, fn) {
  const b = document.createElement("button");
  b.className = "tool"; b.textContent = label; b.onclick = () => fn(b);
  return b;
}
function add(role, text) {
  const m = document.createElement("div");
  m.className = "msg " + role;
  const b = document.createElement("div");
  b.className = "body";
  if (role === "ai") b.innerHTML = md(text); else b.textContent = text;
  m.append(b);
  if (role === "ai") m.append(tool("Copy", btn =>
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = "Copied"; setTimeout(() => btn.textContent = "Copy", 1500);
    })));
  feed.append(m); feed.classList.add("has"); feed.scrollTop = feed.scrollHeight;
  return m;
}
function fail(text) {
  const m = add("err", text + ". Check your connection and try again.");
  m.append(tool("Retry", () => { m.remove(); busy = true; sync(); run(); }));
}
const sync = () => { send.disabled = busy || !input.value.trim(); };
const grow = () => { input.style.height = "auto"; input.style.height = input.scrollHeight + "px"; };

async function run() {
  const dots = document.createElement("div");
  dots.className = "msg ai";
  dots.innerHTML = '<div class="dots" role="status" aria-label="NAF AI is thinking"><i></i><i></i><i></i></div>';
  feed.append(dots); feed.scrollTop = feed.scrollHeight;
  try {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msgs[msgs.length - 1].content, messages: msgs.slice(-20) })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.reply) throw new Error(d.error || "NAF AI could not reply");
    dots.remove();
    msgs.push({ role: "assistant", content: d.reply }); save();
    add("ai", d.reply);
  } catch (e) { dots.remove(); fail(e.message); }
  busy = false; sync();
}
function ask(text) {
  text = text.trim();
  if (busy || !text) return;
  busy = true; sync();
  msgs.push({ role: "user", content: text }); save();
  add("user", text);
  run();
}

composer.addEventListener("submit", e => {
  e.preventDefault();
  const t = input.value;
  input.value = ""; grow(); ask(t);
});
input.addEventListener("input", () => { grow(); sync(); });
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); composer.requestSubmit(); }
});
$("#empty").addEventListener("click", e => {
  const q = e.target.closest("button")?.dataset.q;
  if (q) ask(q);
});
$("#reset").onclick = () => {
  if (busy) return;
  msgs = []; save();
  feed.querySelectorAll(".msg").forEach(m => m.remove());
  feed.classList.remove("has"); input.focus();
};

msgs.forEach(m => add(m.role === "user" ? "user" : "ai", m.content));
})();
