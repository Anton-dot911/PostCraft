/**
 * Викликає Netlify Function /.netlify/functions/generate
 * Повертає { posts } або кидає помилку
 */
export async function generatePosts({ description, photo, platforms }) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, photo, platforms }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.posts; // { instagram: "...", tiktok: "...", ... }
}
