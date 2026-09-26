import React, { useState } from "react";
import InputTab from "./components/InputTab";
import ResultTab from "./components/ResultTab";
import TemplatesTab from "./components/TemplatesTab/CanvasEditor";

const TABS = [
  { id: "input", label: "Опис" },
  { id: "result", label: "Пости" },
  { id: "templates", label: "Шаблони" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("input");
  const [posts, setPosts] = useState(null);
  const [templateSeed, setTemplateSeed] = useState(null);

  function handleGenerated(newPosts) {
    setPosts(newPosts);
    setActiveTab("result");
  }

  function handleUseInTemplate(platform, text) {
    setTemplateSeed({ platform, text });
    setActiveTab("templates");
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>PostCraft ✦</h1>
        <p style={styles.subtitle}>Один опис — пости під кожну платформу</p>
      </header>

      <nav style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id ? styles.tabButtonActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {activeTab === "input" && <InputTab onGenerated={handleGenerated} />}
        {activeTab === "result" && (
          <ResultTab posts={posts} onUseInTemplate={handleUseInTemplate} />
        )}
        {activeTab === "templates" && (
          <TemplatesTab seed={templateSeed} />
        )}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#1C2B3C",
    color: "#F2F5F7",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "28px 20px 16px",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    margin: 0,
    color: "#F5C24C",
  },
  subtitle: {
    fontSize: 14,
    color: "#8FA3B3",
    margin: "6px 0 0",
    fontWeight: 500,
  },
  tabBar: {
    display: "flex",
    gap: 6,
    padding: "0 16px",
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    padding: "10px 8px",
    borderRadius: 12,
    border: "none",
    background: "#24384D",
    color: "#8FA3B3",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "inherit",
  },
  tabButtonActive: {
    background: "#F5C24C",
    color: "#1C2B3C",
  },
  main: {
    flex: 1,
    padding: "8px 16px 40px",
    maxWidth: 560,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
};
