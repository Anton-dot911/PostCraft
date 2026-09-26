# PostCraft — Deploy Guide

## Локальна розробка

```bash
# 1. Встанови залежності
npm install

# 2. Скопіюй .env
cp .env.example .env
# Встав свій ANTHROPIC_API_KEY в .env

# 3. Встанови Vercel CLI (один раз)
npm install -g vercel

# 4. Запуск з Vercel Functions локально
vercel dev
# → http://localhost:3000
```

---

## Деплой на Vercel

### Через GitHub (рекомендовано)

```bash
git init
git add .
git commit -m "init: PostCraft PWA"
git remote add origin https://github.com/YOUR_USER/postcraft.git
git push -u origin main
```

Далі на vercel.com:
1. **Add New Project** → **Import Git Repository** → вибери репо
2. Framework Preset: **Vite** (визначиться автоматично)
3. Build Command / Output Directory — залишити за замовчуванням
4. **Environment Variables** → додай `ANTHROPIC_API_KEY`
5. Deploy ✓

### Через Vercel CLI

```bash
vercel login
vercel --prod
```

---

## Environment Variables на Vercel

```
Project Settings → Environment Variables → Add

Key:   ANTHROPIC_API_KEY
Value: sk-ant-xxxxxxxxxxxxxxx
```

⚠️ Ніколи не додавай `.env` в git — він в `.gitignore`.

---

## Структура файлів

```
postcraft/
├── api/
│   └── generate.js          ← Claude API (Vercel serverless function, з підтримкою фото)
├── src/
│   ├── App.jsx               ← головний компонент, таби
│   ├── main.jsx               ← точка входу
│   ├── api.js                 ← виклик /api/generate з фронтенду
│   └── components/
│       ├── InputTab.jsx       ← опис + фото + вибір платформ
│       ├── ResultTab.jsx       ← готові пости, копіювання
│       └── TemplatesTab/
│           ├── CanvasEditor.jsx  ← редактор зображень для соцмереж
│           └── drawTemplate.js   ← логіка малювання на canvas
├── index.html
├── vite.config.js
├── package.json
├── .env.example              ← шаблон (в git)
└── .gitignore                ← .env виключений
```

---

## PWA — додати на Home Screen (iOS)

1. Відкрий сайт у Safari
2. Кнопка Share → **Add to Home Screen**
3. PostCraft з'явиться як нативний застосунок

---

## Відомі обмеження / наступні кроки

- [ ] `manifest.json` + іконки 192×192 і 512×512 в `/public/icons/` — для повноцінного PWA-інсталу (зараз `index.html` посилається на них, але файлів немає)
