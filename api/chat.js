// api/chat.js  (naf-ai-backend, Vercel)
const ALLOWED = ["https://johnnafuh.github.io"];

const SYSTEM = `You are NAF AI, a personal assistant built by John Nafuh.
Be clear, direct and practical. Keep answers short unless the user asks for depth.
Use plain language, and use markdown only for code, lists and bold.`;

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED.includes(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, messages } = req.body || {};
  let history = Array.isArray(messages)
    ? messages
    : message ? [{ role: "user", content: message }] : [];

  history = history
    .filter(m => m && ["user", "assistant"].includes(m.role)
      && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map(m => ({ role: m.role, content: m.content.slice(0, 8000) }));

  while (history.length && history[0].role !== "user") history.shift();
  if (!history.length) return res.status(400).json({ error: "Empty message" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-5-5",
        max_tokens: 1024,
        system: SYSTEM,
        messages: history
      })
    });
    const d = await r.json();
    if (!r.ok) return res.status(502).json({ error: "The AI service returned an error" });

    const reply = (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
    return res.status(200).json({ reply });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}
