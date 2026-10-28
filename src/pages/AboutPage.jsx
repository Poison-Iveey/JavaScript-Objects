import { Card } from "../components/ui/Card.jsx";
import { Icon } from "../components/ui/Icon.jsx";
import { ABOUT_CARDS } from "../data/community.js";
import styles from "./pages.module.css";

export function AboutPage() {
  return (
    <div className={styles.stack} style={{ marginTop: 22, maxWidth: 920 }}>
      <Card roomy className={styles.aboutHero}>
        <span className={styles.eyebrow}>Our story</span>
        <h3 className={styles.serifTitle}>A home for every book you've read</h3>
        <p className={styles.body}>
          Literary Journey is a personal library for readers. Add the books you've read, upload the covers you love, rate them, keep notes and
          favorite quotes, and track how much you read each week.
        </p>
        <p className={styles.body} style={{ color: "var(--muted)" }}>
          We don't host or link to book downloads. Everything here is about your reading life: what you read, what you thought of it, and who
          you share it with.
        </p>
      </Card>
      <div className={styles.aboutGrid}>
        {ABOUT_CARDS.map((a) => (
          <Card roomy key={a.title} className={styles.aboutCard}>
            <Icon name={a.icon} size={22} />
            <strong>{a.title}</strong>
            <span>{a.text}</span>
          </Card>
        ))}
      </div>
      <Card roomy className={styles.contact}>
        <div>
          <strong>Get in touch</strong>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            Questions, feedback or a feature request? Write to <a href="mailto:hello@literaryjourney.app">hello@literaryjourney.app</a>
          </span>
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>Version 0.9</span>
      </Card>
    </div>
  );
}
