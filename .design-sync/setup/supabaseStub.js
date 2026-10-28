// Stand-in for src/services/supabaseClient.js in the Claude Design bundle.
// The real client throws without VITE_SUPABASE_* env vars and would bake the
// project's URL/anon key into the uploaded bundle. Designs get their data from
// ShelvedProvider's in-memory contexts instead, so nothing should reach this —
// every call resolves to an empty, error-free result.

const result = Promise.resolve({ data: null, error: null });

function chain() {
  const handler = {
    get(_target, prop) {
      if (prop === "then") return result.then.bind(result);
      return () => new Proxy(function () {}, handler);
    },
    apply() {
      return new Proxy(function () {}, handler);
    },
  };
  return new Proxy(function () {}, handler);
}

export const supabase = {
  from: () => chain(),
  rpc: () => chain(),
  storage: { from: () => chain() },
  auth: {
    onAuthStateChange: (callback) => {
      setTimeout(() => callback("INITIAL_SESSION", null), 0);
      return { data: { subscription: { unsubscribe() {} } } };
    },
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithOAuth: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
};
