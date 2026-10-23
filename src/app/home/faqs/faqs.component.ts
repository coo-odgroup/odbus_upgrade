import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { serverCached } from '../../services/server-cache';
import { GlobalConstants } from '../../constants/global-constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css'],
})
export class FaqsComponent implements OnInit {
  private apiurl = GlobalConstants.BASE_URL;
  faqs: any[] = [];
  activeTab: number = 0;
  openIndex: number[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit(): void {
    // PAGESPEED FIX: this used to wait 2 s in a setTimeout. Angular's server renderer waits for
    // every pending timer, so every page render was delayed by 2 s (slow TTFB/LCP).
    this.fetchFaqs();
  }

  // private fetchFaqs(): void {
  //   const payload = {};

  //   this.http.post(this.apiurl + '/getfaqs', payload).subscribe((res: any) => {
  //     this.faqs = res.data;
  //     // this.openIndex = this.faqs.map(() => 0);
  //   });
  // }


  private fetchFaqs(): void {
    const call = () => this.http.post<any>(this.apiurl + '/getfaqs', {});
    const source$ = isPlatformServer(this.platformId)
      ? serverCached('faqs', 10 * 60_000, call)
      : call();
    source$.subscribe({
      next: (res: any) => {
        this.faqs = res.data;
        this.openIndex = this.faqs.map(() => -1);
      },
    });
  }
}
