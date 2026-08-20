import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BooksProvider } from "./context/BooksContext.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { SplashPage } from "./pages/SplashPage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { LibraryPage } from "./pages/LibraryPage.jsx";
import { CurrentlyReadingPage } from "./pages/CurrentlyReadingPage.jsx";
import { FavoritesPage } from "./pages/FavoritesPage.jsx";
import { AuthorsPage } from "./pages/AuthorsPage.jsx";
import { AuthorDetailPage } from "./pages/AuthorDetailPage.jsx";
import { GenresPage } from "./pages/GenresPage.jsx";
import { GenreDetailPage } from "./pages/GenreDetailPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { PublicProfilePage } from "./pages/PublicProfilePage.jsx";

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BooksProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SplashPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <LibraryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reading"
                element={
                  <ProtectedRoute>
                    <CurrentlyReadingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/authors"
                element={
                  <ProtectedRoute>
                    <AuthorsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/authors/:author"
                element={
                  <ProtectedRoute>
                    <AuthorDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/genres"
                element={
                  <ProtectedRoute>
                    <GenresPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/genres/:genre"
                element={
                  <ProtectedRoute>
                    <GenreDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/u/:shareSlug" element={<PublicProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </BooksProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
