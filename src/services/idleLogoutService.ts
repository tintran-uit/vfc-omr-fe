/**
 * Auto logout after a period of user inactivity, shared across browser tabs.
 *
 * The last activity timestamp lives in localStorage, so activity in any tab keeps
 * every tab alive, and all tabs time out at the same moment.
 * Configured by VITE_IDLE_LOGOUT_MINUTES (minutes); empty / "null" disables it.
 */

const LAST_ACTIVITY_KEY = 'last_activity_at';
const TOKEN_KEY = 'token';
const ACTIVITY_WRITE_THROTTLE_MS = 5_000;
const CHECK_INTERVAL_MS = 15_000;
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'wheel', 'scroll', 'touchstart'] as const;

let started = false;
let lastWrite = 0;

export function getIdleLogoutMinutes(): number | null {
  const raw = String(import.meta.env.VITE_IDLE_LOGOUT_MINUTES ?? '').trim();
  if (!raw || raw.toLowerCase() === 'null') return null;
  const minutes = Number(raw);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
}

function hasSession() {
  return !!localStorage.getItem(TOKEN_KEY);
}

function readLastActivity(): number | null {
  const value = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function markUserActivity(force = false) {
  if (!hasSession()) return;
  const now = Date.now();
  if (!force && now - lastWrite < ACTIVITY_WRITE_THROTTLE_MS) return;
  lastWrite = now;
  localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
}

export function clearUserActivity() {
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

/**
 * @param onLogout called when this tab must end the session (idle timeout,
 *                 or the session was ended in another tab).
 */
export function startIdleLogout(onLogout: () => void) {
  if (started) return;
  const minutes = getIdleLogoutMinutes();
  if (minutes === null) return;
  started = true;

  const timeoutMs = minutes * 60_000;

  const check = () => {
    if (!hasSession()) return;
    const last = readLastActivity();
    if (last === null) {
      markUserActivity(true);
      return;
    }
    if (Date.now() - last >= timeoutMs) {
      clearUserActivity();
      onLogout();
    }
  };

  const onActivity = () => markUserActivity();
  ACTIVITY_EVENTS.forEach((type) =>
    window.addEventListener(type, onActivity, { passive: true, capture: true })
  );

  // Background tabs throttle timers, so re-check as soon as a tab becomes visible.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === TOKEN_KEY && !event.newValue) onLogout();
  });

  check();
  window.setInterval(check, CHECK_INTERVAL_MS);
}
