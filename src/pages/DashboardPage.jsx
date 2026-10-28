import {
  AddBookCard,
  ChallengesWidget,
  LibraryWidget,
  ProgressChart,
  QuotesWidget,
  ReleasesCalendar,
  WeeklyLogWidget,
} from "../components/dashboard/widgets.jsx";
import styles from "../components/dashboard/widgets.module.css";

export function DashboardPage() {
  return (
    <div className={styles.columns}>
      <div className={styles.column}>
        <LibraryWidget />
        <ProgressChart />
      </div>
      <div className={styles.column}>
        <WeeklyLogWidget />
        <QuotesWidget />
      </div>
      <div className={styles.column}>
        <AddBookCard />
        <ReleasesCalendar />
        <ChallengesWidget />
      </div>
    </div>
  );
}
