import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * PAGESPEED: after the home page is interactive, quietly download the chunks of the pages most
 * visitors open next (search results, booking, login) so they open instantly.
 * Only routes marked `data: { preload: true }` are preloaded; skipped on Data Saver / 2G.
 */
@Injectable({ providedIn: 'root' })
export class IdlePreloadStrategy implements PreloadingStrategy {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Browser only. On the server a pending timer would make every page render wait 3 s
    // (newer Node versions also define `navigator`, so a navigator check is not enough).
    if (!isPlatformBrowser(this.platformId) || !route.data || !route.data['preload']) {
      return of(null);
    }
    const c = (navigator as any).connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) {
      return of(null);
    }
    return timer(3000).pipe(mergeMap(() => load()));
  }
}
