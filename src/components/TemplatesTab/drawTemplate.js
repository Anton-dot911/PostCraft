export const BG_PRESETS = {
  navy: { label: "Navy", colors: ["#1C2B3C", "#0F1826"] },
  gold: { label: "Gold", colors: ["#F5C24C", "#D89A1F"] },
  coral: { label: "Coral", colors: ["#FF6B5E", "#C93F3F"] },
  mint: { label: "Mint", colors: ["#3ECF8E", "#1C9C63"] },
};

export const SIZES = {
  square: { label: "Instagram (1:1)", width: 1080, height: 1080 },
  story: { label: "Stories (9:16)", width: 1080, height: 1920 },
  landscape: { label: "Facebook (1.91:1)", width: 1200, height: 630 },
};

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCoverImage(ctx, img, width, height) {
  const imgRatio = img.width / img.height;
  const canvasRatio = width / height;
  let sx, sy, sWidth, sHeight;
  if (imgRatio > canvasRatio) {
    sHeight = img.height;
    sWidth = sHeight * canvasRatio;
    sx = (img.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.width;
    sHeight = sWidth / canvasRatio;
    sx = 0;
    sy = (img.height - sHeight) / 2;
  }
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
}

export function drawTemplate(canvas, { size, bgPreset, bgImage, title, subtitle }) {
  const { width, height } = SIZES[size] || SIZES.square;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  let textColor;

  if (bgImage) {
    drawCoverImage(ctx, bgImage, width, height);
    // Dark scrim so text stays legible on any photo
    const scrim = ctx.createLinearGradient(0, height * 0.35, 0, height);
    scrim.addColorStop(0, "rgba(15,24,38,0)");
    scrim.addColorStop(1, "rgba(15,24,38,0.75)");
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, width, height);
    textColor = "#F2F5F7";
  } else {
    const preset = BG_PRESETS[bgPreset] || BG_PRESETS.navy;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, preset.colors[0]);
    gradient.addColorStop(1, preset.colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    textColor = bgPreset === "navy" ? "#F2F5F7" : "#1C2B3C";
  }

  const padding = width * 0.1;
  const maxWidth = width - padding * 2;

  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const titleSize = Math.round(width * 0.075);
  ctx.font = `800 ${titleSize}px 'DM Sans', sans-serif`;
  const titleLines = wrapText(ctx, title || "", maxWidth);

  const subtitleSize = Math.round(width * 0.032);
  const subtitleLines = subtitle
    ? (() => {
        ctx.font = `500 ${subtitleSize}px 'DM Sans', sans-serif`;
        return wrapText(ctx, subtitle, maxWidth);
      })()
    : [];

  const titleLineHeight = titleSize * 1.25;
  const subtitleLineHeight = subtitleSize * 1.5;
  const gap = titleSize * 0.6;
  const blockHeight =
    titleLines.length * titleLineHeight +
    (subtitleLines.length ? gap + subtitleLines.length * subtitleLineHeight : 0);

  let y;
  if (bgImage) {
    y = height - padding - blockHeight + titleSize;
  } else {
    y = (height - blockHeight) / 2 + titleSize;
  }

  ctx.font = `800 ${titleSize}px 'DM Sans', sans-serif`;
  for (const line of titleLines) {
    ctx.fillText(line, padding, y);
    y += titleLineHeight;
  }

  if (subtitleLines.length) {
    y += gap - titleLineHeight + subtitleLineHeight;
    ctx.font = `500 ${subtitleSize}px 'DM Sans', sans-serif`;
    ctx.globalAlpha = 0.85;
    for (const line of subtitleLines) {
      ctx.fillText(line, padding, y);
      y += subtitleLineHeight;
    }
    ctx.globalAlpha = 1;
  }
}
