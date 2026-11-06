import { Component, OnInit } from '@angular/core';
import { PopularRoutesService } from '../services/popular-routes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit {
  all_routes: any[] = [];
  currentUrl: string;
  searchText: string;

  per_page = 30;
  page_no = 1;
  loading = false;
  hasMore = true;

  constructor(
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private location: Location,
    private popularRoutesService: PopularRoutesService,
  ) {
    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  ngOnInit(): void {
    this.allRoutes();
  }

  goBack() {
    this.location.back();
  }

  allRoutes(search: string = '') {
    if (this.loading || !this.hasMore) {
      return;
    }

    this.loading = true;
    this.spinner.show();

    this.popularRoutesService
      .getallroutes(this.per_page, this.page_no, search)
      .subscribe({
        next: (res: any) => {
          const result = res?.data?.data || [];

          if (this.page_no === 1) {
            this.all_routes = result; // first page
          } else {
            this.all_routes.push(...result); // load more
          }

          if (result.length < this.per_page) {
            this.hasMore = false;
          } else {
            this.page_no++;
          }

          this.loading = false;
          this.spinner.hide();
        },
        error: () => {
          this.loading = false;
          this.spinner.hide();
        },
      });
  }

  searchRoutes() {
    const search = this.searchText?.trim() || '';

    if (search.length < 3 && search.length > 0) {
      return;
    }

    this.page_no = 1;
    this.hasMore = true;
    this.allRoutes(search);
  }
}
