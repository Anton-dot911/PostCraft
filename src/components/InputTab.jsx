import React, { useState } from "react";
import { generatePosts } from "../api";

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
  { id: "stories", label: "Stories" },
];

export default function InputTab({ onGenerated }) {
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null); // { dataUrl, name }
  const [platforms, setPlatforms] = useState(["instagram", "facebook"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function togglePlatform(id) {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto({ dataUrl: reader.result, name: file.name });
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    setError("");
    if (!description.trim() && !photo) {
      setError("Додайте опис або фото — щось одне обов'язково.");
      return;
    }
    if (platforms.length === 0) {
      setError("Оберіть хоча б одну платформу.");
      return;
    }
    setLoading(true);
    try {
      const posts = await generatePosts({
        description: description.trim(),
        photo: photo?.dataUrl || null,
        platforms,
      });
      onGenerated(posts);
    } catch (err) {
      setError(err.message || "Щось пішло не так. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label style={styles.label}>Опис товару чи послуги</label>
      <textarea
        style={styles.textarea}
        rows={5}
        placeholder="Наприклад: ручної роботи кераміка, обпалена в дровʼяній печі, доставка по Україні"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label style={styles.label}>Фото (необов'язково)</label>
      <label style={styles.photoUpload}>
        {photo ? photo.name : "Обрати фото"}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: "none" }}
        />
      </label>
      {photo && (
        <img src={photo.dataUrl} alt="preview" style={styles.photoPreview} />
      )}

      <label style={styles.label}>Платформи</label>
      <div style={styles.platformGrid}>
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            style={{
              ...styles.platformChip,
              ...(platforms.includes(p.id) ? styles.platformChipActive : {}),
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ ...styles.submit, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Генерую…" : "Згенерувати пости"}
      </button>
    </div>
  );
}

const styles = {
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#8FA3B3",
    marginBottom: 8,
    marginTop: 18,
  },
  textarea: {
    width: "100%",
    background: "#24384D",
    border: "1px solid #34495E",
    borderRadius: 14,
    padding: 14,
    color: "#F2F5F7",
    fontSize: 15,
    fontFamily: "inherit",
    resize: "vertical",
  },
  photoUpload: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    background: "#24384D",
    border: "1px dashed #34495E",
    borderRadius: 14,
    padding: 14,
    color: "#8FA3B3",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  photoPreview: {
    width: "100%",
    maxHeight: 180,
    objectFit: "cover",
    borderRadius: 14,
    marginTop: 10,
  },
  platformGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  platformChip: {
    padding: "9px 16px",
    borderRadius: 999,
    border: "1px solid #34495E",
    background: "#24384D",
    color: "#8FA3B3",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
  },
  platformChipActive: {
    background: "#F5C24C",
    borderColor: "#F5C24C",
    color: "#1C2B3C",
  },
  error: {
    color: "#FF8A8A",
    fontSize: 13,
    marginTop: 14,
    fontWeight: 600,
  },
  submit: {
    width: "100%",
    marginTop: 22,
    padding: "15px",
    borderRadius: 14,
    border: "none",
    background: "#F5C24C",
    color: "#1C2B3C",
    fontWeight: 800,
    fontSize: 15,
    fontFamily: "inherit",
  },
};
