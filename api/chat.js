// api/chat.js  (naf-ai-backend, Vercel) - OpenAI version
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

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Server is missing OPENAI_API_KEY" });
  }

  const { message, messages } = req.body || {};
  let history = Array.isArray(messages)
    ? messages
    : message ? [{ role: "user", content: message }] : [];

  history = history
    .filter(m => m && ["user", "assistant"].includes(m.role)
      && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map(m => ({ role: m.role, content: m.content.slice(0, 8000) }));

  if (!history.length) return res.status(400).json({ error: "Empty message" });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM }, ...history]
      })
    });
    const d = await r.json();
    if (!r.ok) {
      return res.status(502).json({ error: d.error?.message || "The AI service returned an error" });
    }
    return res.status(200).json({ reply: d.choices?.[0]?.message?.content || "" });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}
