import { useEffect, useRef, useCallback } from 'react';

const IDLE_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
  'click',
];

/**
 * Logs the user out after `timeoutMs` milliseconds of inactivity.
 * Activity is detected on common user interaction events.
 * Shows a toast warning 1 minute before logout if the timeout is long enough.
 *
 * @param signOut  - the signOut function from useAuth
 * @param timeoutMs - inactivity duration in ms (default: 30 minutes)
 * @param enabled - only runs when the user is authenticated (default: true)
 */
export function useSessionTimeout(
  signOut: () => Promise<void>,
  timeoutMs = 30 * 60 * 1000,
  enabled = true,
) {
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);
  }, []);

  const resetTimers = useCallback(() => {
    if (!enabled) return;
    clearTimers();

    // Warning 1 minute before (only if total timeout > 2 min)
    const warnAt = timeoutMs - 60_000;
    if (warnAt > 0) {
      warnTimer.current = setTimeout(() => {
        // Lazy-import Sonner toast to avoid circular deps
        import('sonner').then(({ toast }) => {
          toast.warning('You will be logged out in 1 minute due to inactivity.', {
            duration: 55_000,
            id: 'session-warning',
          });
        });
      }, warnAt);
    }

    logoutTimer.current = setTimeout(async () => {
      import('sonner').then(({ toast }) => {
        toast.info('Logged out due to inactivity.', { id: 'session-logout' });
      });
      await signOut();
    }, timeoutMs);
  }, [enabled, signOut, timeoutMs, clearTimers]);

  useEffect(() => {
    if (!enabled) return;

    resetTimers();

    IDLE_EVENTS.forEach(event =>
      window.addEventListener(event, resetTimers, { passive: true })
    );

    return () => {
      clearTimers();
      IDLE_EVENTS.forEach(event =>
        window.removeEventListener(event, resetTimers)
      );
    };
  }, [enabled, resetTimers, clearTimers]);
}
