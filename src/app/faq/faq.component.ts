import { Component, Inject, OnInit, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { of } from 'rxjs';
import { serverCached } from '../services/server-cache';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { PagesService } from '../services/pages.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { LoginChecker } from '../helpers/loginChecker';
import { GlobalConstants } from '../constants/global-constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  currentUrl: any;
  pageTitle: any;
  pageContent: any;

  isMobile: boolean;
  session: LoginChecker;
  MenuActive: boolean = false;
  activeMenu: string = '';

  // Jagan
  private apiurl = GlobalConstants.BASE_URL;
  faqs: any[] = [];
  activeTab: number = 0;
  openIndex: number[] = [];
  // Jagan

  constructor(
    private seo: SeoService,
    private location: Location,
    private pageService: PagesService,
    private spinner: NgxSpinnerService,
    private detectService: DeviceDetectorService,
    private router: Router,
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isMobile = this.detectService.isMobile();
    this.session = new LoginChecker();

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  menu() {
    this.MenuActive = (this.MenuActive == false) ? true : false;
    this.activeMenu = '';
  }

  signOut() {
    this.session.logout();
    this.router.navigate(['login']);
  }

  // Jagan
  ngOnInit(): void {
    this.fetchFaqs();
  }

  // private fetchFaqs(): void {
  //   this.spinner.show();
  //   const payload = {};

  //   this.http.post(this.apiurl + '/getfaqs', payload).subscribe((res: any) => {
  //     this.faqs = res.data;
  //     this.openIndex = this.faqs.map(() => 0);
  //     this.spinner.hide();
  //   });
  // }
  // Jagan

  trackByIndex(index: number): number {
    return index;
  }

  // PAGESPEED: FAQs are rendered on the server and handed to the browser through TransferState,
  // so the browser does not call /getfaqs again and the page never flashes "Loading..." (layout shift).
  private fetchFaqs(): void {
    const key = makeStateKey<any[]>('odbus-faqs');
    if (this.transferState.hasKey(key)) {
      this.faqs = this.transferState.get(key, []);
      this.transferState.remove(key);
      return;
    }

    const call = () => this.http.post<any>(this.apiurl + '/getfaqs', {});
    const request$ = isPlatformServer(this.platformId)
      ? serverCached('faqs-page', 10 * 60_000, call)
      : call();

    request$.subscribe({
      next: (res: any) => {
        this.faqs = (res && res.data) || [];
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(key, this.faqs);
        }
      },
      error: () => {
        this.faqs = [];
      },
    });
  }
}
