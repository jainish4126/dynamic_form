// Small helpers for localStorage (used by app)
export function load(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('load error', e);
    return fallback;
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('save error', e);
  }
}

export function clearKey(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.error('clearKey error', e);
  }
}
