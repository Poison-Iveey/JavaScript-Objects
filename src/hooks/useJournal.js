import { useContext } from "react";
import { JournalContext } from "../context/JournalContext.jsx";

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) throw new Error("useJournal must be used within a JournalProvider, with a signed-in reader.");
  return context;
}
