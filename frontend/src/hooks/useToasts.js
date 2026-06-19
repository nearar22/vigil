import { useCallback, useRef, useState } from 'react';

let counter = 0;

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const tm = timers.current.get(id);
    if (tm) {
      clearTimeout(tm);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (toast) => {
      const id = toast.id ?? `t-${++counter}`;
      setToasts((list) => {
        const next = list.filter((t) => t.id !== id);
        return [...next, { ...toast, id }];
      });
      const tm = timers.current.get(id);
      if (tm) clearTimeout(tm);
      // Loading toasts persist until replaced/dismissed; others auto-expire.
      if (toast.kind !== 'loading') {
        const ttl = toast.kind === 'error' ? 9000 : 6500;
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), ttl)
        );
      }
      return id;
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}
