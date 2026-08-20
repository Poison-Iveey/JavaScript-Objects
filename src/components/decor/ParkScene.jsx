import { FallingLeaves } from "./FallingLeaves.jsx";
import styles from "./ParkScene.module.css";

const DUSK_VARS = {
  "--scene-sky-top": "#3a2740",
  "--scene-sky-bottom": "#1c1220",
  "--scene-hill-back": "rgba(147, 80, 115, 0.3)",
  "--scene-hill-mid": "rgba(58, 39, 64, 0.75)",
  "--scene-hill-front": "rgba(20, 13, 22, 0.92)",
  "--scene-tree": "rgba(147, 80, 115, 0.45)",
  "--scene-figure": "rgba(246, 219, 192, 0.6)",
};

export function ParkScene({ leafCount = 14, variant = "auto" }) {
  const style = variant === "dusk" ? DUSK_VARS : undefined;

  return (
    <div className={styles.scene} style={style} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sceneSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--scene-sky-top)" />
            <stop offset="100%" stopColor="var(--scene-sky-bottom)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="800" height="500" fill="url(#sceneSky)" />

        {/* back hill, subtle idle drift */}
        <path
          className={styles.hillBack}
          d="M-50,330 Q150,270 400,310 T850,290 V500 H-50 Z"
          fill="var(--scene-hill-back)"
        />

        {/* tree silhouettes on the mid hill — kept close to center so they
            survive the aggressive center-crop "slice" does on tall/narrow
            (mobile) viewports; the outer pair is a desktop-only bonus. */}
        <g fill="var(--scene-tree)">
          <path d="M100,300 q-22,-70 0,-95 q22,25 0,95 z" />
          <path d="M150,305 q-16,-55 0,-75 q16,20 0,75 z" />
          <path d="M330,308 q-18,-58 0,-80 q18,22 0,80 z" />
          <path d="M660,290 q-24,-75 0,-102 q24,27 0,102 z" />
          <path d="M710,300 q-18,-58 0,-80 q18,22 0,80 z" />
        </g>

        <path
          d="M-50,370 Q180,310 420,345 T850,330 V500 H-50 Z"
          fill="var(--scene-hill-mid)"
        />

        {/* reading figure, leaning against a tree trunk — centered in the
            viewBox so it stays visible on both portrait and landscape crops */}
        <g transform="translate(430,345)">
          <rect x="-6" y="-95" width="12" height="95" rx="4" fill="var(--scene-tree)" opacity="0.85" />
          <ellipse cx="0" cy="64" rx="52" ry="9" fill="var(--scene-figure)" opacity="0.18" />
          <path
            d="M-28,60 C-30,40 -22,26 -10,22 C-6,20 6,20 10,22 C22,26 30,40 28,60 C16,66 -16,66 -28,60 Z"
            fill="var(--scene-figure)"
          />
          <circle cx="0" cy="4" r="12" fill="var(--scene-figure)" />
          <path d="M-15,34 L-1,29 L-1,44 L-15,49 Z" fill="var(--scene-sky-bottom)" opacity="0.55" />
          <path d="M15,34 L1,29 L1,44 L15,49 Z" fill="var(--scene-sky-bottom)" opacity="0.55" />
        </g>

        {/* front hill, closest layer */}
        <path
          d="M-50,430 Q200,390 430,415 T850,400 V500 H-50 Z"
          fill="var(--scene-hill-front)"
        />
      </svg>

      <FallingLeaves count={leafCount} />
    </div>
  );
}
