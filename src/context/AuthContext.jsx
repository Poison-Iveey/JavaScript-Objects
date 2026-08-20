import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService.js";
import { supabase } from "../services/supabaseClient.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // onAuthStateChange fires immediately with the current session on
    // subscribe (INITIAL_SESSION), then again on sign-in/out/token-refresh —
    // this is the single source of truth for session state, including the
    // moment a Google OAuth redirect lands back on the app.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (!session) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const currentUser = await authService.getCurrentUser();
      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (fields) => {
    const { user: newUser } = await authService.signUp(fields);
    setUser(newUser);
    return newUser;
  }, []);

  const signIn = useCallback(async (fields) => {
    const { user: signedInUser } = await authService.signIn(fields);
    setUser(signedInUser);
    return signedInUser;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Navigates the browser to Google's consent screen — there's no user to
    // return here. The onAuthStateChange listener above updates `user` once
    // the browser redirects back with a session.
    await authService.signInWithGoogle();
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (fields) => {
      if (!user) throw new Error("No signed-in user.");
      const updated = await authService.updateProfile(user.id, fields);
      setUser(updated);
      return updated;
    },
    [user]
  );

  const updateSharingSettings = useCallback(
    async (settings) => {
      if (!user) throw new Error("No signed-in user.");
      const updated = await authService.updateSharingSettings(user.id, settings);
      setUser(updated);
      return updated;
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, isLoading, signUp, signIn, signInWithGoogle, signOut, updateProfile, updateSharingSettings }),
    [user, isLoading, signUp, signIn, signInWithGoogle, signOut, updateProfile, updateSharingSettings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
