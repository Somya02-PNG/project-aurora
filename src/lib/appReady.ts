/** Tiny readiness bus to gate the preloader on real asset/scene readiness. */
export type ReadyKey = "video" | "scene";

const marked = new Set<ReadyKey>();
const listeners = new Set<() => void>();

export function markReady(key: ReadyKey) {
  if (marked.has(key)) return;
  marked.add(key);
  listeners.forEach((l) => l());
}

export function isReady(key: ReadyKey) {
  return marked.has(key);
}

/**
 * Resolves once all `keys` are marked ready, or after `timeoutMs`.
 * Returns an unsubscribe function (no-op once resolved).
 */
export function onAllReady(
  keys: ReadyKey[],
  cb: () => void,
  timeoutMs = 4500,
): () => void {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    listeners.delete(check);
    clearTimeout(t);
    cb();
  };
  const check = () => {
    if (keys.every((k) => marked.has(k))) finish();
  };
  const t = setTimeout(finish, timeoutMs);
  listeners.add(check);
  check();
  return () => {
    done = true;
    listeners.delete(check);
    clearTimeout(t);
  };
}
