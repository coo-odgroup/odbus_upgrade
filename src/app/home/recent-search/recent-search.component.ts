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

    console.log('Stored Searches:', storedSearches);

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

  // openRecent(item: any) {
  //   this.router.navigate(
  //     ['/routes', `${item.source}-${item.destination}-bus-services`],
  //     {
  //       queryParams: {
  //         date: this.getValidDate(item.date),
  //       },
  //     },
  //   );
  // }

  openRecent(item: any): void {
    const validDate = this.getValidDate(item.date);

    // If date is expired, update only the matching history record
    if (validDate !== item.date) {
      let history = JSON.parse(localStorage.getItem('recentSearches') || '[]');

      const existingIndex = history.findIndex(
        (record: any) =>
          record.source === item.source &&
          record.destination === item.destination,
      );

      if (existingIndex !== -1) {
        history[existingIndex] = {
          ...history[existingIndex],
          date: validDate,
          url: `routes/${item.source}-${item.destination}-bus-services?date=${validDate}`,
        };

        localStorage.setItem('recentSearches', JSON.stringify(history));

        this.recentSearches = history;
      }
    }

    // Navigate using the valid date
    this.router.navigate(
      ['/routes', `${item.source}-${item.destination}-bus-services`],
      {
        queryParams: {
          date: validDate,
        },
      },
    );
  }
}
