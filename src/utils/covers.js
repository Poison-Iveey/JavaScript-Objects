// Generated cover art for books without an uploaded cover: a gradient panel
// with the title set in Cinzel or Cormorant, drawn on a canvas.

const COVERS = [
  { type: "r", cy: 0.3, r: 300, stops: [[0, "#4a3560"], [1, "#1b1328"]], font: "500 46px 'Cormorant Garamond'", px: 46, color: "#efe4d6", align: "top" },
  { type: "l", stops: [[0, "#141a30"], [0.4, "#3a2c3c"], [0.75, "#9a6a46"], [1, "#c99462"]], font: "500 56px 'Cinzel'", px: 56, color: "#f2d3a6", align: "bottom" },
  { type: "r", cy: 0.45, r: 320, stops: [[0, "#5e2c40"], [1, "#2a1320"]], font: "500 30px 'Cinzel'", px: 30, color: "#ddb47c", align: "center" },
  { type: "r", cy: 0.4, r: 320, stops: [[0, "#2c3e6a"], [1, "#191536"]], font: "500 32px 'Cinzel'", px: 32, color: "#e8def6", align: "center" },
  { type: "l", stops: [[0, "#3c4a3a"], [1, "#1a2119"]], font: "500 44px 'Cormorant Garamond'", px: 44, color: "#e9e0c8", align: "center" },
  { type: "r", cy: 0.7, r: 320, stops: [[0, "#7a4a2a"], [1, "#24140e"]], font: "500 32px 'Cinzel'", px: 32, color: "#f3d7a8", align: "top" },
];

export const COVER_COUNT = COVERS.length;

const cache = {};
let fontsReady = false;

// Covers drawn before the webfonts load use a fallback face, so they're not
// cached until the fonts are in; callers re-render once this resolves.
export function whenCoverFontsReady() {
  if (fontsReady || typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return Promise.all(["500 40px 'Cinzel'", "500 40px 'Cormorant Garamond'"].map((f) => document.fonts.load(f)))
    .then(() => document.fonts.ready)
    .then(() => {
      fontsReady = true;
    })
    .catch(() => {});
}

// Stable palette index for a book id (uuid or number).
export function coverIndex(id) {
  const s = String(id ?? "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % COVERS.length;
}

export function generatedCover({ cov = 0, text = "" }) {
  const c = COVERS[cov % COVERS.length];
  const key = cov + "|" + text;
  if (cache[key]) return cache[key];
  if (typeof document === "undefined") return "";
  const cv = document.createElement("canvas");
  cv.width = 300;
  cv.height = 400;
  const x = cv.getContext("2d");
  const g =
    c.type === "l" ? x.createLinearGradient(0, 0, 0, 400) : x.createRadialGradient(150, 400 * c.cy, 0, 150, 400 * c.cy, c.r);
  c.stops.forEach(([o, col]) => g.addColorStop(o, col));
  x.fillStyle = g;
  x.fillRect(0, 0, 300, 400);
  x.strokeStyle = "rgba(0,0,0,.18)";
  x.lineWidth = 12;
  x.strokeRect(0, 0, 300, 400);
  x.strokeStyle = "rgba(255,255,255,.1)";
  x.lineWidth = 2;
  x.strokeRect(1, 1, 298, 398);
  x.font = c.font;
  x.fillStyle = c.color;
  x.textAlign = "center";
  x.textBaseline = "top";
  const lines = [];
  let ln = "";
  text.split(/\s+/).forEach((w) => {
    const t = ln ? ln + " " + w : w;
    if (x.measureText(t).width > 250 && ln) {
      lines.push(ln);
      ln = w;
    } else ln = t;
  });
  if (ln) lines.push(ln);
  const lh = c.px * 1.15;
  const th = lines.length * lh;
  const y0 = c.align === "top" ? 40 : c.align === "bottom" ? 360 - th : (400 - th) / 2;
  lines.forEach((l, i) => x.fillText(l, 150, y0 + i * lh));
  const url = cv.toDataURL("image/jpeg", 0.88);
  if (fontsReady) cache[key] = url;
  return url;
}
