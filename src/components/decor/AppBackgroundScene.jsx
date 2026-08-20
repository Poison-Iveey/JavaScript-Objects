import { FallingLeaves } from "./FallingLeaves.jsx";
import styles from "./AppBackgroundScene.module.css";

// Ambient, low-opacity backdrop for the authenticated app screens (Library,
// Favorites, Currently Reading, Authors, Genres, Settings). Unlike ParkScene
// (the Splash/Auth hero moment), this has to stay out of the way of real
// content: fixed, non-interactive, and subtle enough that book cards/text
// read exactly as they would on a plain background.
export function AppBackgroundScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <div className={styles.sun} />
      <div className={styles.cloud1} />
      <div className={styles.cloud2} />
      <div className={styles.cloud3} />

      <svg className={styles.treeline} viewBox="0 0 800 60" preserveAspectRatio="none">
        <path
          d="M0,60 L0,40 q20,-30 40,-6 q15,-20 30,-2 q18,-26 36,-4 q20,-24 40,0 q16,-18 32,-2 L200,40
             q22,-28 44,-4 q18,-22 36,-2 q20,-26 40,-2 q16,-16 32,0 L400,38
             q20,-30 40,-6 q15,-20 30,-2 q18,-26 36,-4 q20,-24 40,0 q16,-18 32,-2 L600,40
             q22,-28 44,-4 q18,-22 36,-2 q20,-26 40,-2 q16,-16 32,0 L800,38 L800,60 Z"
          fill="var(--ambient-line)"
        />
      </svg>

      <div className={styles.cyclist}>
        <svg viewBox="0 0 48 24" width="48" height="24">
          <g fill="none" stroke="var(--scene-tree)" strokeWidth="2" strokeLinecap="round">
            <circle cx="10" cy="18" r="5" />
            <circle cx="34" cy="18" r="5" />
            <path d="M10 18 L20 8 L28 18 M20 8 L17 4 M17 4 L13 4 M20 8 L34 18 M20 8 L24 8" />
          </g>
        </svg>
      </div>

      <FallingLeaves count={7} opacity={0.4} />
    </div>
  );
}
