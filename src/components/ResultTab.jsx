import React, { useState } from "react";

const PLATFORM_LABELS = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
  stories: "Stories",
};

export default function ResultTab({ posts, onUseInTemplate }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!posts) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>
          Тут з'являться готові пости — спочатку заповніть опис у вкладці
          "Опис".
        </p>
      </div>
    );
  }

  function handleCopy(key, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }

  const entries = Object.entries(posts).filter(([, text]) => !!text);

  return (
    <div>
      {entries.map(([key, text]) => (
        <div key={key} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.platformName}>
              {PLATFORM_LABELS[key] || key}
            </span>
            <button
              onClick={() => handleCopy(key, text)}
              style={styles.copyButton}
            >
              {copiedKey === key ? "Скопійовано ✓" : "Копіювати"}
            </button>
          </div>
          <p style={styles.postText}>{text}</p>
          <button
            onClick={() => onUseInTemplate(key, text)}
            style={styles.templateButton}
          >
            Використати в шаблоні →
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  empty: {
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyText: {
    color: "#8FA3B3",
    fontSize: 15,
    lineHeight: 1.5,
  },
  card: {
    background: "#24384D",
    border: "1px solid #34495E",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  platformName: {
    fontWeight: 800,
    fontSize: 14,
    color: "#F5C24C",
  },
  copyButton: {
    background: "transparent",
    border: "1px solid #34495E",
    borderRadius: 999,
    padding: "6px 12px",
    color: "#8FA3B3",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "inherit",
  },
  postText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#F2F5F7",
    whiteSpace: "pre-wrap",
    margin: 0,
  },
  templateButton: {
    marginTop: 12,
    background: "transparent",
    border: "none",
    color: "#F5C24C",
    fontWeight: 700,
    fontSize: 13,
    fontFamily: "inherit",
    padding: 0,
  },
};
