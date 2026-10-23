import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

/**
 * PAGESPEED FIX (TTFB): during server-side rendering the page waits for API calls
 * (/homedata, /allseolist ...). Those responses are the same for every visitor, so the Node
 * process keeps them in memory for a short time. Concurrent requests share one in-flight call.
 *
 * Only use on the server (guard with isPlatformServer). Never cache user-specific data here.
 */
interface Entry { at: number; obs: Observable<any>; }
const store = new Map<string, Entry>();
const MAX_ENTRIES = 500;

export function serverCached<T>(
  key: string,
  ttlMs: number,
  factory: () => Observable<T>,
): Observable<T> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && now - hit.at < ttlMs) {
    return hit.obs as Observable<T>;
  }
  if (store.size >= MAX_ENTRIES) {
    // drop the oldest entry
    const oldest = store.keys().next().value;
    if (oldest !== undefined) { store.delete(oldest); }
  }
  const obs = factory().pipe(shareReplay({ bufferSize: 1, refCount: false }));
  const entry: Entry = { at: now, obs };
  store.set(key, entry);
  // do not keep failed calls: the next request retries
  obs.subscribe({ error: () => { if (store.get(key) === entry) { store.delete(key); } } });
  return obs;
}
