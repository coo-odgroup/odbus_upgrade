import { Injectable, Inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, throwError, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { GlobalConstants } from '../constants/global-constants';
import { serverCached } from './server-cache';

const HOME_DATA_KEY = makeStateKey<any>('odbus-homedata');
const HOME_DATA_PARAMS = {
  user_id: GlobalConstants.MASTER_SETTING_USER_ID,
  is_popular_routes: 1,
  is_top_routes: 1,
};

@Injectable({
  providedIn: 'root',
})
export class PopularRoutesService {
  private apiURL = GlobalConstants.BASE_URL;
  private homeData$!: Observable<any>;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  all(): Observable<any> {
    return this.httpClient
      .get<any>(this.apiURL + '/PopularRoutes', this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  allroutes(per_page, page_no): Observable<any> {
    return this.httpClient
      .get<any>(
        this.apiURL + '/AllRoutes?per_page=' + per_page + '&page_no=' + page_no,
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler));
  }

  // getallroutes(per_page: any, page_no: any): Observable<any> {
  //   return this.httpClient
  //     .post<any>(
  //       this.apiURL + '/getallroutes',
  //       {
  //         per_page,
  //         page_no,
  //       },
  //       this.httpOptions,
  //     )
  //     .pipe(catchError(this.errorHandler));
  // }

  getallroutes(
    per_page: any,
    page_no: any,
    search: string = '',
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.apiURL + '/getallroutes',
        {
          per_page,
          page_no,
          search,
        },
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler));
  }

  downloadApp(params): Observable<any> {
    return this.httpClient
      .post<any>(
        this.apiURL + '/downloadapp',
        JSON.stringify(params),
        this.httpOptions,
      )
      .pipe(catchError(this.errorHandler));
  }

  /**
   * PAGESPEED FIX: the server already fetched /homedata while rendering. We pass that
   * response to the browser via TransferState so the browser (a) does not call the API again
   * and (b) has popular routes/banner/popup on the very first render. Without this the
   * page rebuilt itself empty and the "Popular Routes" block popped back in -> big CLS.
   */
  getHomeData(params: any): Observable<any> {
    if (!this.homeData$) {
      if (!isPlatformServer(this.platformId)) {
        if (this.transferState.hasKey(HOME_DATA_KEY)) {
          const cached = this.transferState.get(HOME_DATA_KEY, null);
          this.transferState.remove(HOME_DATA_KEY);
          this.homeData$ = of(cached);
          return this.homeData$;
        }

        // SSR embeds all transferred keys. Take this one out as soon as the service
        // is constructed so it does not serialize itself back into the page.
        this.transferState.remove(HOME_DATA_KEY);
      }

      const call = () => this.httpClient.post<any>(this.apiURL + '/homedata', params);
      const source$ = isPlatformServer(this.platformId)
        ? serverCached('homedata:' + JSON.stringify(params), 60_000, call) // 60 s shared by all visitors
        : call();
      this.homeData$ = source$.pipe(
        tap((res) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(HOME_DATA_KEY, res);
          }
        }),
        shareReplay(1)
      );
    }

    return this.homeData$;
  }

  /** Load the home hero data during bootstrap so it is present in the SSR HTML. */
  preloadHomeData(): Promise<any> {
    return new Promise((resolve) => {
      this.getHomeData(HOME_DATA_PARAMS).subscribe(
        (data) => resolve(data),
        () => resolve(null),
      );
    });
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage: any;
    if (error.error instanceof HttpErrorResponse) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error;

      //`Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
