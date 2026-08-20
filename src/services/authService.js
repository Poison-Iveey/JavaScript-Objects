import { supabase } from "./supabaseClient.js";
import { createId } from "../utils/id.js";

const DEFAULT_VISIBILITY = { showCurrentlyReading: true, showFavorites: true, showRatings: true };

function mapProfile(authUser, profileRow) {
  if (!authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    displayName: profileRow?.display_name ?? authUser.email?.split("@")[0] ?? "Reader",
    avatarUrl: profileRow?.avatar_url ?? null,
    shareSlug: profileRow?.share_slug ?? null,
    isProfilePublic: profileRow?.is_profile_public ?? false,
    profileVisibility: profileRow
      ? {
          showCurrentlyReading: profileRow.show_currently_reading,
          showFavorites: profileRow.show_favorites,
          showRatings: profileRow.show_ratings,
        }
      : DEFAULT_VISIBILITY,
  };
}

async function fetchProfileRow(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw new Error(error.message);
  return data;
}

async function buildUser(authUser) {
  if (!authUser) return null;
  const profileRow = await fetchProfileRow(authUser.id);
  return mapProfile(authUser, profileRow);
}

export async function signUp({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName || email.split("@")[0] } },
  });
  if (error) throw new Error(error.message);

  // Email confirmation may be required (project setting) — in that case
  // auth.users exists but there's no session yet, so there's nothing to log
  // the user into. Surface that clearly instead of silently failing below.
  if (!data.session) {
    throw new Error("Check your email to confirm your account, then log in.");
  }

  return { user: await buildUser(data.user) };
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return { user: await buildUser(data.user) };
}

// Real Google OAuth is a redirect flow: this call navigates the browser away
// to Google's consent screen and back, so there's no user to return here.
// AuthContext's onAuthStateChange listener picks up the resulting session
// once the browser lands back on redirectTo.
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth` },
  });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return buildUser(data.session.user);
}

export async function updateProfile(userId, { displayName, email, avatarFile }) {
  const patch = {};
  if (displayName !== undefined) patch.display_name = displayName;

  if (avatarFile) {
    const ext = avatarFile.name.includes(".") ? avatarFile.name.split(".").pop() : "jpg";
    const path = `${userId}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("covers").upload(path, avatarFile, { upsert: true });
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = supabase.storage.from("covers").getPublicUrl(path);
    patch.avatar_url = `${publicUrlData.publicUrl}?t=${Date.now()}`;
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
    if (error) throw new Error(error.message);
  }

  if (email) {
    // Supabase requires confirming the new address via email before it takes
    // effect, so the returned user below may still show the old email until
    // that confirmation happens — that's expected, not a bug.
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) throw new Error(emailError.message);
  }

  const { data: authData } = await supabase.auth.getUser();
  return buildUser(authData.user);
}

export async function updateSharingSettings(userId, { isProfilePublic, profileVisibility }) {
  const current = await fetchProfileRow(userId);
  const shareSlug = isProfilePublic && !current.share_slug ? createId() : current.share_slug;

  const patch = { is_profile_public: isProfilePublic, share_slug: shareSlug };
  if (profileVisibility) {
    patch.show_currently_reading = profileVisibility.showCurrentlyReading;
    patch.show_favorites = profileVisibility.showFavorites;
    patch.show_ratings = profileVisibility.showRatings;
  }

  const { data, error } = await supabase.from("profiles").update(patch).eq("id", userId).select().single();
  if (error) throw new Error(error.message);

  const { data: authData } = await supabase.auth.getUser();
  return mapProfile(authData.user, data);
}

// Reads from the public_profiles VIEW, not the profiles table — that view
// already enforces is_profile_public = true at the SQL layer, so there's no
// separate check needed (or possible to get wrong) here.
export async function getUserByShareSlug(slug) {
  const { data, error } = await supabase.from("public_profiles").select("*").eq("share_slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    id: data.id,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    shareSlug: data.share_slug,
    // Real per-profile visibility is already applied inside the public_books
    // view server-side — this default is just a shape placeholder for callers.
    profileVisibility: DEFAULT_VISIBILITY,
  };
}
