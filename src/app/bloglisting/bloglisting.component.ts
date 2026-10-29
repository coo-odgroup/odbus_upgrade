
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { PagesService } from '../services/pages.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-bloglisting',
  templateUrl: './bloglisting.component.html',
  styleUrls: ['./bloglisting.component.css'],
})
export class BlogListingComponent implements OnInit {
  pageTitle = 'Blog';

  pageContent: any;
  currentUrl: any;

  blogData: any = null;
  categoryData: any[] = [];
  blogContent: any = null;

  slug: string | null = null;
  tag_slug: string | null = null;
  author_slug: string | null = null;

  private apiURL = GlobalConstants.BASE_URL;
  baseurl = GlobalConstants.PATHURL;

  constructor(
    private pagesService: PagesService,
    private seo: SeoService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadBlogStaticContent();

    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug');
      this.tag_slug = params.get('tag_slug');
      this.author_slug = params.get('author_slug');

      this.route.queryParams.subscribe((queryParams) => {
        const page = queryParams['page'];

        this.updateBlogSeo(page);

        if (!page || page === '1') {
          if (page === '1') {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {},
              replaceUrl: true,
            });

            return;
          }

          this.loadBlogs(
            this.slug,
            this.tag_slug,
            this.author_slug,
          );
        } else {
          const pageUrl = `${this.apiURL}/bloglist?page=${encodeURIComponent(page)}`;
          this.getList(pageUrl);
        }
      });
    });
  }

  private updateBlogSeo(page: string | null): void {
    this.seo.seolist('/blog').subscribe({
      next: (response: any) => {
        if (response?.data) {
          let metaTitle = response.data.meta_title || 'ODBUS Blog';

          if (page && Number(page) > 1) {
            metaTitle += ` | Page ${page}`;
          }

          this.seo.setPageTitle(metaTitle);
          this.seo.addCanonicalUrl();
        }
      },
      error: (error: any) => {
        console.error('Failed to load blog SEO data:', error);
      },
    });
  }

  private loadBlogStaticContent(): void {
    try {
      const cachedContent = localStorage.getItem('blogContent');

      if (cachedContent) {
        const data = JSON.parse(cachedContent);

        if (Array.isArray(data)) {
          this.blogContent = data[0] || null;
        }

        if (this.blogContent) {
          return;
        }
      }
    } catch (error) {
      console.error('Failed to read cached blog content:', error);
    }

    const params = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
      page_url: 'blog',
    };

    this.pagesService.PageContent(params).subscribe({
      next: (res: any) => {
        const data = res?.data;

        if (Array.isArray(data)) {
          this.blogContent = data[0] || null;

          try {
            localStorage.setItem('blogContent', JSON.stringify(data));
          } catch (error) {
            console.warn('Unable to cache blog content:', error);
          }
        }
      },
      error: (error: any) => {
        console.error('Failed to load blog page content:', error);
      },
    });
  }

  loadBlogs(
    slug: string | null,
    tag_slug: string | null,
    author_slug: string | null,
  ): void {
    this.spinner.show();

    const formData = new FormData();
    formData.append('cat_slug', slug || '');
    formData.append('tag_slug', tag_slug || '');
    formData.append('author_slug', author_slug || '');

    this.http.post(`${this.apiURL}/bloglist`, formData).subscribe({
      next: (res: any) => {
        this.setBlogResponse(res);
        this.spinner.hide();
      },
      error: (error: any) => {
        console.error('Blog API error:', error);
        this.spinner.hide();
      },
    });
  }

  getList(url: string): void {
    this.spinner.show();

    const formData = new FormData();
    formData.append('cat_slug', this.slug || '');
    formData.append('tag_slug', this.tag_slug || '');
    formData.append('author_slug', this.author_slug || '');

    let page: string | null = null;

    try {
      page = new URL(url, window.location.origin).searchParams.get('page');
    } catch (error) {
      console.error('Invalid blog pagination URL:', error);
      this.spinner.hide();
      return;
    }

    if (page === '1') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true,
      });
    } else if (page) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: '',
      });
    }

    this.http.post(url, formData).subscribe({
      next: (res: any) => {
        this.setBlogResponse(res);
        this.spinner.hide();
      },
      error: (error: any) => {
        console.error('Blog pagination API error:', error);
        this.spinner.hide();
      },
    });
  }

  private setBlogResponse(res: any): void {
    this.blogData = res?.data?.blogs || null;
    this.categoryData = Array.isArray(res?.data?.categories)
      ? res.data.categories
      : [];
  }

  changePage(page: number): void {
    if (page <= 1) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true,
      });

      this.loadBlogs(this.slug, this.tag_slug, this.author_slug);
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: '',
    });
  }
}
