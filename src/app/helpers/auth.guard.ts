import {
  Injectable,
  Inject,
  PLATFORM_ID
} from "@angular/core";

import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  UrlTree,
  Router,
  RouterStateSnapshot
} from "@angular/router";

import {
  isPlatformBrowser,
  isPlatformServer
} from "@angular/common";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanMatch {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // SSR SIDE
    if (isPlatformServer(this.platformId)) {
      return true;
    }

    // BROWSER SIDE
    const user = localStorage.getItem('user');

    if (user) {
      return true;
    }

    this.router.navigate(['login']);

    return false;
  }

  // PAGESPEED: used with `canMatch` so visitors who are not logged in never download the
  // (large) user-account chunks; they are sent straight to /login.
  canMatch(): boolean | UrlTree {
    if (isPlatformServer(this.platformId)) {
      return true;
    }
    return localStorage.getItem('user') ? true : this.router.createUrlTree(['login']);
  }
}
