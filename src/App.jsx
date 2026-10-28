import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BooksProvider } from "./context/BooksContext.jsx";
import { JournalProvider } from "./context/JournalContext.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { LibraryPage } from "./pages/LibraryPage.jsx";
import { ReadingLogPage } from "./pages/ReadingLogPage.jsx";
import { QuotesPage } from "./pages/QuotesPage.jsx";
import { ChallengesPage } from "./pages/ChallengesPage.jsx";
import { SocialPage } from "./pages/SocialPage.jsx";
import { MessagesPage } from "./pages/MessagesPage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { ProfilePage, ReaderPage } from "./pages/ProfilePage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { PublicProfilePage } from "./pages/PublicProfilePage.jsx";

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BooksProvider>
          <JournalProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/u/:shareSlug" element={<PublicProfilePage />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AppShell />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/wishlist" element={<LibraryPage wishlist />} />
                  <Route path="/log" element={<ReadingLogPage />} />
                  <Route path="/quotes" element={<QuotesPage />} />
                  <Route path="/challenges" element={<ChallengesPage />} />
                  <Route path="/social" element={<SocialPage />} />
                  <Route path="/readers/:readerId" element={<ReaderPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/messages/:readerId" element={<MessagesPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:postId" element={<BlogPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:tab" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </JournalProvider>
        </BooksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
