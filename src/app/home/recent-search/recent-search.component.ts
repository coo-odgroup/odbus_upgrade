import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-search',
  templateUrl: './recent-search.component.html',
  styleUrls: ['./recent-search.component.css'],
})
export class RecentSearchComponent implements OnInit {
  // router: any;
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  recentSearches: any[] = [];

  ngOnInit(): void {
    // The component is rendered during SSR, where localStorage is unavailable.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const storedSearches = localStorage.getItem('recentSearches');

    if (storedSearches) {
      this.recentSearches = JSON.parse(storedSearches);
    }
  }

  formatDate(date: string): Date {
    const parts = date.split('-');
    return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  }

  getValidDate(date: string): string {
    const parts = date.split('-');
    const searchDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (searchDate < today) {
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();

      return `${dd}-${mm}-${yyyy}`;
    }

    return date;
  }

  openRecent(item:any) {
    this.router.navigate(
        ['/routes', `${item.source}-${item.destination}-bus-services`],
        {
            queryParams: {
                date: this.getValidDate(item.date)
            }
        }
    );
}
}
