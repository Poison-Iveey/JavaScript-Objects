import { createContext, useEffect, useMemo, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { getJSON, setJSON } from "../services/storage.js";

const THEME_KEY = "theme";

export const ThemeContext = createContext(null);

function getInitialTheme() {
  const stored = getJSON(THEME_KEY);
  // Dark ("Midnight Library") is the house default; "Parchment" is opt-in.
  return stored === "light" ? "light" : "dark";
}

// Keeps the native status bar in sync with the in-app theme toggle — without
// this it stays stuck on whatever capacitor.config.json set as the default,
// which only matches one of the two themes.
function syncNativeStatusBar(theme) {
  if (!Capacitor.isNativePlatform()) return;
  // Style.Dark = dark content (for a light bar); Style.Light = light content
  // (for a dark bar) — named after the content color, not the app theme.
  StatusBar.setStyle({ style: theme === "dark" ? Style.Light : Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: theme === "dark" ? "#0F0B1D" : "#EFE9E6" }).catch(() => {});
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setJSON(THEME_KEY, theme);
    syncNativeStatusBar(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
