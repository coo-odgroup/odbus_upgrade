
import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../constants/global-constants';
import { PopularRoutesService } from '../services/popular-routes.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css'],
})
export class SitemapComponent implements OnInit {
  topOperators: any[] = [];
  topRoutes: any[] = [];

  constructor(
    private homeService: PopularRoutesService,
  ) { }

  ngOnInit(): void {
    this.loadCachedOperators();
    this.loadTopRoutes();
  }

  private loadCachedOperators(): void {
    try {
      const data = localStorage.getItem('PopularInfo');

      if (!data) {
        return;
      }

      const parsedData = JSON.parse(data);

      if (Array.isArray(parsedData?.topOperators)) {
        this.topOperators = parsedData.topOperators;
      }
    } catch (error) {
      console.error('Error reading cached sitemap data:', error);
    }
  }

  private loadTopRoutes(): void {
    const params = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      is_popular_routes: 1,
      is_top_routes: 1
    };

    this.homeService.getHomeData(params).subscribe({
      next: (res: any) => {
        console.log('Sitemap API response:', res);
        console.log('Top routes data:', res?.data?.top_routes);

        if (res?.status == 1) {
          const routes = res?.data?.top_routes;

          this.topRoutes = Array.isArray(routes) ? routes : [];

          console.log('Final topRoutes:', this.topRoutes);
        } else {
          this.topRoutes = [];
          console.warn('Sitemap API did not return success:', res);
        }
      },
      error: (error: any) => {
        this.topRoutes = [];
        console.error('Failed to load top routes:', error);
      }
    });
  }
}
