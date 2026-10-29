
import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-blogdetails',
  templateUrl: './blogdetails.component.html',
  styleUrls: ['./blogdetails.component.css'],
})
export class BlogDetailComponent implements OnInit {
  pageTitle = 'Blog Details';
  pageContent: any;
  currentUrl: any;

  slug: any;
  blogDetail: any = null;
  blogcat: any[] = [];
  related_blogs: any[] = [];

  private apiUrl = GlobalConstants.BASE_URL;
  baseurl = GlobalConstants.PATHURL;

  breadcrumbSchema: any;

  constructor(
    private seo: SeoService,
    private location: Location,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.currentUrl = this.location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      const res = data?.blogData;

      if (!res) {
        console.error('No data from blog resolver');
        return;
      }

      this.blogDetail = res?.data?.blogs || null;
      this.blogcat = Array.isArray(res?.data?.categories)
        ? res.data.categories
        : [];
      this.related_blogs = Array.isArray(res?.data?.related_blogs)
        ? res.data.related_blogs
        : [];
    });
  }

  loadBlogs(slug: any): void {
    this.spinner.show();

    const reqData = { slug };

    this.http.post(`${this.apiUrl}/blogdetails`, reqData).subscribe({
      next: (res: any) => {
        this.blogDetail = res?.data?.blogs || null;
        this.blogcat = Array.isArray(res?.data?.categories)
          ? res.data.categories
          : [];
        this.related_blogs = Array.isArray(res?.data?.related_blogs)
          ? res.data.related_blogs
          : [];

        this.spinner.hide();
      },
      error: (error: any) => {
        console.error('Blog details API error:', error);
        this.spinner.hide();
      },
    });
  }

  getdata(): void {
    alert('working');
  }
}
