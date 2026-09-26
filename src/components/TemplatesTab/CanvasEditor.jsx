import React, { useEffect, useRef, useState } from "react";
import { drawTemplate, BG_PRESETS, SIZES } from "./drawTemplate";

export default function CanvasEditor({ seed }) {
  const canvasRef = useRef(null);
  const [size, setSize] = useState("square");
  const [bgPreset, setBgPreset] = useState("navy");
  const [bgImage, setBgImage] = useState(null); // loaded HTMLImageElement | null
  const [bgImageName, setBgImageName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // Prefill from a post sent over from the Result tab
  useEffect(() => {
    if (!seed) return;
    const firstSentence = seed.text.split(/(?<=[.!?])\s/)[0] || seed.text;
    setTitle(firstSentence.slice(0, 60));
    setSubtitle(seed.text.slice(firstSentence.length).trim().slice(0, 140));
  }, [seed]);

  useEffect(() => {
    if (canvasRef.current) {
      drawTemplate(canvasRef.current, { size, bgPreset, bgImage, title, subtitle });
    }
  }, [size, bgPreset, bgImage, title, subtitle]);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => setBgImage(img);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    setBgImageName(file.name);
  }

  function clearPhoto() {
    setBgImage(null);
    setBgImageName("");
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `postcraft-${size}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const dims = SIZES[size];

  return (
    <div>
      <label style={styles.label}>Розмір</label>
      <div style={styles.row}>
        {Object.entries(SIZES).map(([id, s]) => (
          <button
            key={id}
            onClick={() => setSize(id)}
            style={{
              ...styles.chip,
              ...(size === id ? styles.chipActive : {}),
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <label style={styles.label}>Фон</label>
      {bgImage ? (
        <div style={styles.photoRow}>
          <span style={styles.photoName}>{bgImageName}</span>
          <button onClick={clearPhoto} style={styles.clearButton}>
            Прибрати фото
          </button>
        </div>
      ) : (
        <>
          <div style={styles.row}>
            {Object.entries(BG_PRESETS).map(([id, p]) => (
              <button
                key={id}
                onClick={() => setBgPreset(id)}
                style={{
                  ...styles.swatch,
                  background: p.colors[0],
                  ...(bgPreset === id ? styles.swatchActive : {}),
                }}
                aria-label={p.label}
              />
            ))}
          </div>
          <label style={styles.photoUpload}>
            Або завантажити фото як фон
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
          </label>
        </>
      )}

      <label style={styles.label}>Заголовок</label>
      <input
        style={styles.input}
        value={title}
        maxLength={60}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Головний текст на картинці"
      />

      <label style={styles.label}>Підзаголовок (необов'язково)</label>
      <input
        style={styles.input}
        value={subtitle}
        maxLength={140}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Додатковий рядок"
      />

      <div style={styles.previewWrap}>
        <canvas
          ref={canvasRef}
          style={{
            ...styles.canvas,
            aspectRatio: `${dims.width} / ${dims.height}`,
          }}
        />
      </div>

      <button onClick={handleDownload} style={styles.download}>
        Завантажити PNG
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
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    padding: "9px 14px",
    borderRadius: 999,
    border: "1px solid #34495E",
    background: "#24384D",
    color: "#8FA3B3",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "inherit",
  },
  chipActive: {
    background: "#F5C24C",
    borderColor: "#F5C24C",
    color: "#1C2B3C",
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "2px solid transparent",
  },
  swatchActive: {
    border: "2px solid #F2F5F7",
  },
  photoUpload: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    background: "#24384D",
    border: "1px dashed #34495E",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    color: "#8FA3B3",
    fontSize: 13,
    fontWeight: 600,
    textAlign: "center",
  },
  photoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    background: "#24384D",
    border: "1px solid #34495E",
    borderRadius: 12,
    padding: "10px 12px",
  },
  photoName: {
    fontSize: 13,
    color: "#F2F5F7",
    fontWeight: 600,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  clearButton: {
    background: "transparent",
    border: "1px solid #34495E",
    borderRadius: 999,
    padding: "6px 12px",
    color: "#FF8A8A",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
    flexShrink: 0,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#24384D",
    border: "1px solid #34495E",
    borderRadius: 12,
    padding: 12,
    color: "#F2F5F7",
    fontSize: 14,
    fontFamily: "inherit",
  },
  previewWrap: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #34495E",
  },
  canvas: {
    width: "100%",
    display: "block",
  },
  download: {
    width: "100%",
    marginTop: 16,
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
