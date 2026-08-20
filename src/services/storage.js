const NAMESPACE = "shelved";

function namespacedKey(key) {
  return `${NAMESPACE}.${key}`;
}

export function getJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(namespacedKey(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setJSON(key, value) {
  localStorage.setItem(namespacedKey(key), JSON.stringify(value));
}

export function removeItem(key) {
  localStorage.removeItem(namespacedKey(key));
}
