
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { PagesService } from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit {
  pageTitle: string = 'About ODBUS';
  pageContent: string = '';
  currentUrl: string;

  constructor(
    private pagesService: PagesService,
    private seo: SeoService,
    private location: Location,
    private spinner: NgxSpinnerService
  ) {
    this.currentUrl = this.location.path().replace(/^\/+/, '');
    this.seo.seolist(this.currentUrl);
  }

  ngOnInit(): void {
    this.loadAboutContent();
  }

  private loadAboutContent(): void {
    const param = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      page_url: 'about-us',
    };

    this.spinner.show();

    this.pagesService.PageContent(param).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.data)) {
          this.aboutContent(res.data);
        }

        this.spinner.hide();
      },
      error: (error: any) => {
        console.error('Failed to load About Us content:', error);
        this.spinner.hide();
      },
    });
  }

  private aboutContent(res: any[]): void {
    if (res.length > 0) {
      this.pageTitle = res[0].page_name || 'About ODBUS';
      this.pageContent = res[0].page_description || '';
    }
  }
}
