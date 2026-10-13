import { Component, Input, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-top-routes',
  templateUrl: './top-routes.component.html',
  styleUrls: ['./top-routes.component.css', '../home.component.css'],
})
export class TopRoutesComponent implements OnChanges {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @Input() popularRoutes: any[] = [];

  displayedRoutes: any = [];
  showAllRoutes = false;
  isMobile = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    } else {
      this.isMobile = false; // Default for SSR
    }
    if (changes['popularRoutes'] && this.popularRoutes?.length) {
      this.displayedRoutes = this.isMobile
        ? this.popularRoutes.slice(0, 5)
        : this.popularRoutes;
    }
  }

  viewAllRoutes() {
    this.showAllRoutes = true;
    this.displayedRoutes = this.popularRoutes;
  }

  popularSearch(sr: any, ds: any) {
    this.router.navigate(['routes/' + sr + '-' + ds + '-bus-services']);
  }
}
