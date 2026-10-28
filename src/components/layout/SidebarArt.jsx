import styles from "./SidebarArt.module.css";

// Decorative night-reading still life for the foot of the sidebar: a stack
// of leather-bound books with a lit candle, an inkwell and quill, a crescent
// moon, and a trail of stars rising from the flame up the sidebar.
// Pure SVG (no image files), drawn with gradients for depth; it sits on
// the sidebar background with no frame so it blends in.

const W = 184;
const H = 300;

// Rising constellation from the flame tip toward the top of the panel.
const TRAIL = [
  { x: 108, y: 112, r: 1.5, d: "0s" },
  { x: 117, y: 96, r: 1.9, d: "0.7s" },
  { x: 110, y: 79, r: 2.3, d: "1.4s" },
  { x: 123, y: 62, r: 2.7, d: "0.3s" },
  { x: 140, y: 50, r: 3.1, d: "1.9s" },
  { x: 133, y: 30, r: 2.6, d: "1.1s" },
  { x: 154, y: 16, r: 3.5, d: "2.4s" },
];

const DUST = [
  [20, 96, 0.8], [64, 74, 0.7], [86, 34, 0.9], [58, 18, 0.6], [168, 70, 0.8], [172, 132, 0.6],
  [12, 150, 0.7], [76, 118, 0.6], [100, 52, 0.7], [160, 40, 0.6], [44, 108, 0.5], [176, 104, 0.7],
];

const EMBERS = [
  { dx: "-6px", d: "0s" },
  { dx: "5px", d: "1.3s" },
  { dx: "-2px", d: "2.6s" },
  { dx: "8px", d: "3.9s" },
];

const sparkle = ({ x, y, r }) =>
  `M${x} ${y - r * 2.6}Q${x + r * 0.35} ${y - r * 0.35} ${x + r * 2.6} ${y}Q${x + r * 0.35} ${y + r * 0.35} ${x} ${y + r * 2.6}Q${x - r * 0.35} ${y + r * 0.35} ${x - r * 2.6} ${y}Q${x - r * 0.35} ${y - r * 0.35} ${x} ${y - r * 2.6}Z`;

// One book seen spine-on: rounded spine shading, boards, gilt bands and
// title tooling. `top` adds the visible cover and page edge above it.
function Book({ id, x, y, w, h, rot, colors, top = false }) {
  const [hi, mid, lo] = colors;
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <defs>
        <linearGradient id={`${id}-spine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hi} />
          <stop offset="0.45" stopColor={mid} />
          <stop offset="1" stopColor={lo} />
        </linearGradient>
      </defs>
      {top && (
        <>
          {/* cover seen from above, with a sliver of page edge */}
          <path d={`M${x + 3} ${y + 0.5} L${x + w - 3} ${y + 0.5} L${x + w - 9} ${y - 7} L${x + 9} ${y - 7} Z`} fill={hi} />
          <path d={`M${x + 8} ${y - 0.5} L${x + w - 8} ${y - 0.5} L${x + w - 12} ${y - 5} L${x + 12} ${y - 5} Z`} fill="url(#lj-pages)" />
        </>
      )}
      <rect x={x} y={y} width={w} height={h} rx="3.5" fill={`url(#${id}-spine)`} />
      <rect x={x} y={y} width={w} height={h} rx="3.5" fill="url(#lj-cyl)" />
      <rect x={x - 1.5} y={y - 0.8} width={w + 3} height="2" rx="1" fill={lo} />
      <rect x={x - 1.5} y={y + h - 1.2} width={w + 3} height="2" rx="1" fill={lo} />
      {[0.13, 0.87].map((f) => (
        <g key={f}>
          <rect x={x + w * f - 1.6} y={y + 1.5} width="1.4" height={h - 3} fill="url(#lj-gilt)" />
          <rect x={x + w * f + 1.4} y={y + 1.5} width="0.7" height={h - 3} fill="url(#lj-gilt)" opacity="0.8" />
        </g>
      ))}
      <rect x={cx - w * 0.17} y={cy - 2.2} width={w * 0.34} height="1.6" rx="0.8" fill="url(#lj-gilt)" />
      <rect x={cx - w * 0.1} y={cy + 1.6} width={w * 0.2} height="1" rx="0.5" fill="url(#lj-gilt)" opacity="0.75" />
      <rect x={x + 2} y={y + 1.5} width={w - 4} height="1.2" rx="0.6" fill="#fff" opacity="0.14" />
    </g>
  );
}

export function SidebarArt() {
  return (
    <div className={styles.frame} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" className={styles.svg}>
        <defs>
          {/* spine roundness: dark at both ends, lit across the middle */}
          <linearGradient id="lj-cyl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.5" />
            <stop offset="0.14" stopColor="#000" stopOpacity="0" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="0.86" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="lj-gilt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f7dc95" />
            <stop offset="0.5" stopColor="#d1a14e" />
            <stop offset="1" stopColor="#8e6527" />
          </linearGradient>
          <linearGradient id="lj-pages" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efe2c6" />
            <stop offset="1" stopColor="#c9b28a" />
          </linearGradient>
          <linearGradient id="lj-wax" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d9c39c" />
            <stop offset="0.28" stopColor="#fff6e2" />
            <stop offset="0.6" stopColor="#efdcb6" />
            <stop offset="1" stopColor="#a8875a" />
          </linearGradient>
          <linearGradient id="lj-brass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7a5420" />
            <stop offset="0.35" stopColor="#f3d692" />
            <stop offset="0.7" stopColor="#c08e3e" />
            <stop offset="1" stopColor="#6b4518" />
          </linearGradient>
          <linearGradient id="lj-glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#14223f" />
            <stop offset="0.35" stopColor="#2b4677" />
            <stop offset="1" stopColor="#0b1224" />
          </linearGradient>
          <linearGradient id="lj-feather" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#d8cdbb" />
            <stop offset="0.6" stopColor="#fbf6ec" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <radialGradient id="lj-moon" cx="0.35" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#fff4d2" />
            <stop offset="0.7" stopColor="#ecc777" />
            <stop offset="1" stopColor="#c99a45" />
          </radialGradient>
          <radialGradient id="lj-halo">
            <stop offset="0" stopColor="#f3cf83" stopOpacity="0.28" />
            <stop offset="1" stopColor="#f3cf83" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lj-candlelight">
            <stop offset="0" stopColor="#ffbe5c" stopOpacity="0.42" />
            <stop offset="0.45" stopColor="#ff9d3c" stopOpacity="0.14" />
            <stop offset="1" stopColor="#ff9d3c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lj-hot">
            <stop offset="0" stopColor="#fff1c2" stopOpacity="0.85" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lj-spark">
            <stop offset="0" stopColor="#ffe6a6" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ffe6a6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lj-flame-outer" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ff7a1f" />
            <stop offset="1" stopColor="#ffb64a" stopOpacity="0.85" />
          </linearGradient>
          <filter id="lj-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="lj-blur1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" />
          </filter>
          <mask id="lj-crescent">
            <rect width={W} height={H} fill="#fff" />
            <circle cx="42" cy="44" r="13.5" fill="#000" />
          </mask>
        </defs>

        {/* faint star dust */}
        {DUST.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} className={styles.dust} style={{ animationDelay: `${(i % 5) * 0.8}s` }} />
        ))}

        {/* crescent moon with halo and craters */}
        <circle cx="34" cy="50" r="30" fill="url(#lj-halo)" />
        <g mask="url(#lj-crescent)">
          <circle cx="34" cy="50" r="16" fill="url(#lj-moon)" />
          <circle cx="26" cy="52" r="2.2" fill="#b98a3e" opacity="0.35" />
          <circle cx="30" cy="60" r="1.4" fill="#b98a3e" opacity="0.3" />
          <circle cx="23" cy="44" r="1.1" fill="#b98a3e" opacity="0.3" />
        </g>

        {/* constellation rising from the flame */}
        <polyline
          points={`104,${118} ${TRAIL.map((s) => `${s.x},${s.y}`).join(" ")}`}
          fill="none"
          className={styles.trail}
          strokeWidth="0.8"
          strokeDasharray="1.2 3.6"
          strokeLinecap="round"
        />
        {TRAIL.map((s) => (
          <g key={`${s.x}-${s.y}`} className={styles.star} style={{ animationDelay: s.d }}>
            <circle cx={s.x} cy={s.y} r={s.r * 3.4} fill="url(#lj-spark)" />
            <path d={sparkle(s)} className={styles.sparkle} />
            <circle cx={s.x} cy={s.y} r={s.r * 0.45} fill="#fffaf0" />
          </g>
        ))}

        {/* candlelight washing over the scene */}
        <circle cx="104" cy="140" r="96" fill="url(#lj-candlelight)" className={styles.glow} />

        {/* ground shadow */}
        <ellipse cx="96" cy="279" rx="84" ry="5.5" fill="#000" opacity="0.38" filter="url(#lj-soft)" />

        {/* quill, behind the stack */}
        <g>
          <path d="M33 262 L52 150" stroke="#cdbfa6" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M35 246 C 24 214 30 172 52 150 C 55 182 47 220 37 246 Z" fill="url(#lj-feather)" />
          <path d="M35 246 C 30 214 36 176 52 150" fill="none" stroke="#b9ab92" strokeWidth="0.6" opacity="0.8" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const t = i / 8;
            const sx = 35 + (52 - 35) * t;
            const sy = 246 - (246 - 150) * t;
            return <path key={i} d={`M${sx} ${sy} l ${-7 + t * 3} ${-6}`} stroke="#bfb29b" strokeWidth="0.45" opacity="0.7" />;
          })}
        </g>

        {/* inkwell */}
        <g>
          <rect x="17" y="258" width="28" height="22" rx="6" fill="url(#lj-glass)" />
          <rect x="17" y="266" width="28" height="14" rx="5" fill="#070b16" opacity="0.55" />
          <rect x="24" y="251" width="14" height="8" rx="2" fill="url(#lj-glass)" />
          <rect x="22.5" y="249" width="17" height="3.4" rx="1.6" fill="url(#lj-brass)" />
          <rect x="20.5" y="261" width="2.6" height="15" rx="1.3" fill="#fff" opacity="0.35" />
          <rect x="40.5" y="263" width="1.2" height="10" rx="0.6" fill="#fff" opacity="0.15" />
        </g>

        {/* the stack */}
        <Book id="lj-b1" x={50} y={256} w={124} h={24} rot={0} colors={["#7b4b98", "#4e2c64", "#21102c"]} />
        <Book id="lj-b2" x={56} y={232} w={110} h={23} rot={-1.6} colors={["#3e8086", "#215257", "#0b2326"]} />
        <Book id="lj-b3" x={50} y={210} w={114} h={21} rot={1.2} colors={["#a8455d", "#6e2436", "#2b0b14"]} top />

        {/* warm light pooling on the top cover */}
        <ellipse cx="104" cy="205" rx="40" ry="6" fill="#ffc46b" opacity="0.22" filter="url(#lj-blur1)" />

        {/* brass dish */}
        <ellipse cx="104" cy="207" rx="21" ry="4.6" fill="#5c3c12" />
        <ellipse cx="104" cy="205.6" rx="21" ry="4.4" fill="url(#lj-brass)" />
        <ellipse cx="104" cy="205" rx="15" ry="2.6" fill="#8a5f22" opacity="0.6" />
        <path d="M124 205 a4.5 3 0 1 1 4 3.5" fill="none" stroke="url(#lj-brass)" strokeWidth="1.6" />

        {/* candle */}
        <rect x="96" y="152" width="16" height="53" rx="2" fill="url(#lj-wax)" />
        <path d="M97 154 q-1.2 9 0.6 13 q1.8 1.6 2 -3.5 l0 -9.5 z" fill="url(#lj-wax)" />
        <path d="M108.5 154 q1.8 6 0.4 9.5 q-1.5 1 -1.8 -2.5 z" fill="#f3e1bd" />
        <ellipse cx="104" cy="152.5" rx="8" ry="2.2" fill="#fbeccc" />
        <ellipse cx="104" cy="152.6" rx="5" ry="1.2" fill="#f2cf8e" />
        <path d="M104 152.5 q0.9 -3.5 -0.3 -6.5" stroke="#2a1a10" strokeWidth="1.3" fill="none" strokeLinecap="round" />

        {/* flame: hot halo, outer, inner, core, blue base */}
        <g className={styles.flame}>
          <circle cx="104" cy="134" r="16" fill="url(#lj-hot)" opacity="0.7" />
          <path d="M104 112 C 113 124 114 137 104 147 C 94 137 95 124 104 112 Z" fill="url(#lj-flame-outer)" opacity="0.9" />
          <path d="M104 121 C 109.5 129 110 138 104 144.5 C 98 138 98.5 129 104 121 Z" fill="#ffd56e" />
          <ellipse cx="104" cy="140" rx="2.8" ry="5" fill="#fff8e4" />
          <ellipse cx="104" cy="145.5" rx="2.6" ry="1.4" fill="#7fb2ff" opacity="0.55" />
        </g>

        {/* embers drifting up */}
        {EMBERS.map((e) => (
          <circle key={e.d} cx="104" cy="114" r="1.1" className={styles.ember} style={{ "--dx": e.dx, animationDelay: e.d }} />
        ))}
      </svg>
    </div>
  );
}
