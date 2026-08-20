import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { AppHeader } from "../layout/AppHeader.jsx";
import styles from "./CategoryIndexList.module.css";

export function CategoryIndexList({ title, items, emptyMessage }) {
  return (
    <>
      <AppHeader title={title} />
      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className={styles.list}>
          {items.map(({ name, count, to }) => (
            <Link key={to} to={to} className={styles.row}>
              <span className={styles.name}>{name}</span>
              <span className={styles.count}>{count}</span>
              <ChevronRight size={18} strokeWidth={1.75} className={styles.chevron} />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
