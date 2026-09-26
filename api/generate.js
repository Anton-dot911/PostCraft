module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    const { description, photo, platforms } = body || {};

    if (!description && !photo) {
      return res.status(400).json({ error: "Немає контенту для генерації" });
    }
    if (!Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: "Оберіть хоча б одну платформу" });
    }

    const PLATFORM_RULES = {
      instagram: "Instagram: до 2200 символів, 10-15 хештегів, емодзі, storytelling тон. Хештеги окремим рядком знизу.",
      tiktok: "TikTok: до 150 символів, hook перше речення (інтригуючий), 3-5 трендових хештегів, молодіжний тон.",
      facebook: "Facebook: до 500 символів, дружній тон, заклик до дії наприкінці, 1-2 хештеги.",
      x: "X (Twitter): строго до 280 символів, лаконічно, 1-2 хештеги, без зайвих слів.",
      stories: "Stories overlay: до 60 символів, ВЕЛИКІ ЛІТЕРИ або короткі фрази, заклик до дії.",
    };

    const selectedRules = platforms
      .filter((p) => PLATFORM_RULES[p])
      .map((p) => `### ${p.toUpperCase()}\n${PLATFORM_RULES[p]}`)
      .join("\n\n");

    const promptText = `Ти — контент-менеджер соціальних мереж. Створи пости для кожної платформи на основі опису${photo ? " і доданого фото" : ""}.

ОПИС ТОВАРУ/ПОСЛУГИ:
${description || "(без опису — орієнтуйся на фото)"}

ПРАВИЛА ДЛЯ ПЛАТФОРМ:
${selectedRules}

Відповідай ТІЛЬКИ у форматі JSON без markdown-обгортки:
{
  "instagram": "текст поста",
  "tiktok": "текст поста",
  "facebook": "текст поста",
  "x": "текст поста",
  "stories": "текст поста"
}

Включай лише ті платформи, які є у списку: ${platforms.join(", ")}.
Пиши українською мовою.`;

    const content = [];
    if (photo) {
      const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(photo);
      if (match) {
        content.push({
          type: "image",
          source: { type: "base64", media_type: match[1], data: match[2] },
        });
      }
    }
    content.push({ type: "text", text: promptText });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 2048,
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic error:", errText);
      return res.status(502).json({ error: "Помилка Claude API" });
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const posts = JSON.parse(cleaned);

    return res.status(200).json({ posts });
  } catch (err) {
    console.error("Function error:", err);
    return res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
