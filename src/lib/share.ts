/**
 * Share utilities for transformation cards.
 *
 * - `transformationSlug`  → URL-safe slug for a member name
 * - `transformationShareUrl` → deep link that auto-opens the lightbox for that member
 * - `generateShareImage`  → renders a clean 1200×630 social card to a Blob
 * - `shareTransformation` → tries Web Share API with image+url, otherwise copies link
 *                           and downloads the image. Returns the channel used.
 */

export function transformationSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function transformationShareUrl(name: string): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.origin + "/transformations");
  url.searchParams.set("member", transformationSlug(name));
  return url.toString();
}

type ShareInput = {
  name: string;
  caption: string;
  detail: string;
  program: string;
  tag: string;
  initial: string;
  /** Optional after image to feature on the card */
  imageSrc?: string;
};

/** Load an image as same-origin (or via CORS-allowed) for canvas drawing. */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function generateShareImage(t: ShareInput): Promise<Blob | null> {
  if (typeof document === "undefined") return null;
  const W = 1200;
  const H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background — deep onyx with electric mesh gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b0f1a");
  bg.addColorStop(1, "#101826");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Radial accent glow (electric blue)
  const glow1 = ctx.createRadialGradient(W * 0.85, H * 0.15, 50, W * 0.85, H * 0.15, 600);
  glow1.addColorStop(0, "rgba(56,140,255,0.55)");
  glow1.addColorStop(1, "rgba(56,140,255,0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  // Radial accent glow (neon green)
  const glow2 = ctx.createRadialGradient(W * 0.1, H * 0.95, 30, W * 0.1, H * 0.95, 500);
  glow2.addColorStop(0, "rgba(74,222,128,0.45)");
  glow2.addColorStop(1, "rgba(74,222,128,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Right-side image panel (square-ish)
  const panelW = 460;
  const panelX = W - panelW - 60;
  const panelY = 60;
  const panelH = H - 120;

  // Image (or initial fallback)
  const img = t.imageSrc ? await loadImage(t.imageSrc) : null;
  ctx.save();
  roundedRect(ctx, panelX, panelY, panelW, panelH, 28);
  ctx.clip();
  if (img) {
    // cover-fit
    const ir = img.width / img.height;
    const pr = panelW / panelH;
    let dw = panelW, dh = panelH, dx = panelX, dy = panelY;
    if (ir > pr) {
      dh = panelH;
      dw = dh * ir;
      dx = panelX - (dw - panelW) / 2;
    } else {
      dw = panelW;
      dh = dw / ir;
      dy = panelY - (dh - panelH) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
    // dark gradient overlay for text legibility (none needed here)
  } else {
    const grad = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
    grad.addColorStop(0, "#1e3a8a");
    grad.addColorStop(1, "#15803d");
    ctx.fillStyle = grad;
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.font = "bold 320px Oswald, Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(t.initial, panelX + panelW / 2, panelY + panelH / 2);
  }
  ctx.restore();

  // Panel border
  ctx.save();
  roundedRect(ctx, panelX, panelY, panelW, panelH, 28);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(74,222,128,0.85)";
  ctx.stroke();
  ctx.restore();

  // "AFTER" badge on panel
  ctx.fillStyle = "#4ade80";
  roundedRect(ctx, panelX + 24, panelY + 24, 110, 38, 6);
  ctx.fill();
  ctx.fillStyle = "#04130a";
  ctx.font = "bold 18px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("AFTER", panelX + 24 + 55, panelY + 24 + 19);

  // ── Left content ──
  const leftX = 70;
  let y = 90;

  // Eyebrow
  ctx.fillStyle = "#4ade80";
  ctx.font = "bold 22px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`HALL OF CHAMPIONS  ·  ${t.tag.toUpperCase()}`, leftX, y);
  y += 50;

  // Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px Oswald, Inter, sans-serif";
  ctx.fillText(t.name, leftX, y);
  y += 60;

  // Caption (big stat) — wrap to ~16 chars-ish per line, max 2 lines
  ctx.fillStyle = "#7dd3fc";
  ctx.font = "bold 52px Oswald, Inter, sans-serif";
  const captionLines = wrapText(ctx, t.caption, 600);
  for (const line of captionLines.slice(0, 2)) {
    ctx.fillText(line, leftX, y);
    y += 60;
  }
  y += 6;

  // Detail
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "400 24px Inter, sans-serif";
  const detailLines = wrapText(ctx, t.detail, 600);
  for (const line of detailLines.slice(0, 3)) {
    ctx.fillText(line, leftX, y);
    y += 32;
  }

  // Footer brand
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "bold 20px Inter, sans-serif";
  ctx.fillText("TOTAL FITNESS STUDIO  ·  CHROMEPET, CHENNAI", leftX, H - 60);
  ctx.fillStyle = "#4ade80";
  ctx.fillText("totalfitstudio.in", leftX, H - 32);

  return await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png", 0.92),
  );
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export type ShareChannel = "native" | "clipboard" | "download" | "failed";

export async function shareTransformation(t: ShareInput): Promise<ShareChannel> {
  if (typeof window === "undefined") return "failed";
  const url = transformationShareUrl(t.name);
  const title = `${t.name} — ${t.caption}`;
  const text = `${t.name}'s real transformation at Total Fitness Studio, Chromepet — ${t.caption}.`;

  const blob = await generateShareImage(t);
  const file =
    blob && typeof File !== "undefined"
      ? new File([blob], `${transformationSlug(t.name)}-totalfit.png`, { type: "image/png" })
      : null;

  // 1) Native share with file (mobile + supported desktop)
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };
  if (file && nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title, text, url });
      return "native";
    } catch {
      /* fall through */
    }
  }
  // 1b) Native share without file
  if (nav.share) {
    try {
      await nav.share({ title, text, url });
      return "native";
    } catch {
      /* fall through */
    }
  }

  // 2) Copy URL to clipboard + download image
  let copied = false;
  try {
    await navigator.clipboard.writeText(url);
    copied = true;
  } catch {
    /* ignore */
  }
  if (blob) {
    const a = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = `${transformationSlug(t.name)}-totalfit.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    return copied ? "clipboard" : "download";
  }
  return copied ? "clipboard" : "failed";
}
