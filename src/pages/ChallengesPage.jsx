import { useRef } from "react";
import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Button, controlStyles } from "../components/ui/controls.jsx";
import { ChallengeRing } from "../components/dashboard/ChallengeRing.jsx";
import { useJournal } from "../hooks/useJournal.js";
import { useLibrary } from "../hooks/useLibrary.js";
import styles from "./pages.module.css";

export function ChallengesPage() {
  const { challenges, addChallenge } = useJournal();
  const { books } = useLibrary();
  const nameRef = useRef(null);
  const goalRef = useRef(null);
  const readCount = books.filter((b) => b.status === "read").length;

  const save = () => {
    const n = nameRef.current?.value.trim();
    const g = parseInt(goalRef.current?.value, 10);
    if (!n || !g) return;
    addChallenge(n, g);
    nameRef.current.value = "";
    goalRef.current.value = "";
  };
  const onKey = (e) => e.key === "Enter" && save();

  return (
    <div className={styles.stack}>
      <Card roomy>
        <CardHeader icon="flag" title="New challenge" />
        <div className={styles.formRow} style={{ marginTop: 14 }}>
          <input
            ref={nameRef}
            placeholder="Challenge name, e.g. 12 classics"
            className={controlStyles.input}
            style={{ flex: "1 1 240px", width: "auto" }}
            onKeyDown={onKey}
          />
          <input
            ref={goalRef}
            type="number"
            min="1"
            placeholder="Goal"
            className={controlStyles.input}
            style={{ flex: "0 1 110px", width: "auto" }}
            onKeyDown={onKey}
          />
          <Button onClick={save}>Add challenge</Button>
        </div>
      </Card>
      <div className={styles.ringGrid}>
        {challenges.map((c, i) => (
          <ChallengeRing key={c.id} challenge={c} index={i} readCount={readCount} large />
        ))}
      </div>
    </div>
  );
}
