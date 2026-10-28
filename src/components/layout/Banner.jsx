import { useEffect, useRef } from "react";
import { useJournal } from "../../hooks/useJournal.js";

const VIDEO = "/media/header.mp4";

// The looping header film. A small blurred patch hides a corner mark in the
// footage; its colour is sampled from the frame continuously so it blends in.
export function Banner() {
  const { settings } = useJournal();
  const videoRef = useRef(null);
  const patchRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    if (settings.pauseVideo) el.pause();
    else el.play()?.catch(() => {});
  }, [settings.pauseVideo]);

  useEffect(() => {
    const el = videoRef.current;
    const cv = document.createElement("canvas");
    cv.width = 2;
    cv.height = 1;
    const x = cv.getContext("2d", { willReadFrequently: true });
    let raf;
    const tick = () => {
      if (el && el.readyState >= 2 && patchRef.current) {
        const w = el.videoWidth;
        const h = el.videoHeight;
        x.drawImage(el, w * 0.03, h * 0.06, 4, 4, 0, 0, 1, 1);
        x.drawImage(el, w * 0.16, h * 0.06, 4, 4, 1, 0, 1, 1);
        const d = x.getImageData(0, 0, 2, 1).data;
        patchRef.current.style.background = `rgb(${(d[0] + d[4]) >> 1},${(d[1] + d[5]) >> 1},${(d[2] + d[6]) >> 1})`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        margin: "var(--banner-m)",
        borderRadius: "var(--banner-r)",
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "#1b1328",
      }}
    >
      <video ref={videoRef} src={VIDEO} loop muted playsInline autoPlay style={{ display: "block", width: "100%", height: "auto" }} />
      <div
        ref={patchRef}
        style={{
          position: "absolute",
          left: "5.5%",
          top: "1.5%",
          width: "9.5%",
          height: "12%",
          borderRadius: 8,
          background: "#1e1830",
          filter: "blur(3px)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "var(--veil)" }} />
      <div
        style={{
          position: "absolute",
          right: 16,
          bottom: 14,
          background: "var(--cap-bg)",
          color: "var(--cap-ink)",
          fontFamily: "var(--cap-font)",
          fontStyle: "var(--cap-style)",
          fontSize: "var(--cap-size)",
          padding: "3px 8px",
          borderRadius: 3,
        }}
      >
        “A curated space for bookworms
      </div>
    </div>
  );
}
