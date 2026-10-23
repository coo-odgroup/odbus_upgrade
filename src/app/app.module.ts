import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PageErrorComponent } from './page-error/page-error.component';
import { AppInitializerService } from './services/initializer.service';
import { ToastrModule } from 'ngx-toastr';
import { NgbDateParserFormatter, NgbTypeaheadModule, NgbDatepickerModule, NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomdateformatService } from "./services/customdateformat.service";
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthInterceptor } from './shared/auth.interceptor';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuard } from './helpers/auth.guard';
import { AuthModule } from '@auth0/auth0-angular';
import { PnrdetailComponent } from './pnrdetail/pnrdetail.component';
import { ProfiledeleteComponent } from './profiledelete/profiledelete.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RecentSearchComponent } from './home/recent-search/recent-search.component';
import { AdvantageComponent } from './home/advantage/advantage.component';
import { GrowingComponent } from './home/growing/growing.component';
import { DownloadAppComponent } from './home/download-app/download-app.component';
import { OdbusOffersComponent } from './home/odbus-offers/odbus-offers.component';
import { FaqsComponent } from './home/faqs/faqs.component';
import { InfoComponent } from './home/info/info.component';
import { RouteLinksComponent } from './home/route-links/route-links.component';
import { TopOperatorsComponent } from './home/top-operators/top-operators.component';
import { TopRoutesComponent } from './home/top-routes/top-routes.component';
import { CommonContentComponent } from './common-content/common-content.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SearchBoxMComponent } from './search-box-m/search-box-m.component';
import { MobileAppDownloadComponent } from './home/mobile-app-download/mobile-app-download.component';
import { SharedModule } from './shared/shared.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SitemapComponent } from './sitemap/sitemap.component';
import { OnlinebusticketsComponent } from './onlinebustickets/onlinebustickets.component';
import { NgOptimizedImage } from '@angular/common';

export function appInit(appInitializerService: AppInitializerService) {
  return () => appInitializerService.load();
}


export function tokenGetter() {
  // Only access localStorage in browser
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem("access_token");
  }
  return null;
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    // PageErrorComponent,
    // PnrdetailComponent,
    ProfiledeleteComponent,
    RecentSearchComponent,
    AdvantageComponent,
    GrowingComponent,
    DownloadAppComponent,
    OdbusOffersComponent,
    FaqsComponent,
    InfoComponent,
    RouteLinksComponent,
    TopOperatorsComponent,
    TopRoutesComponent,
    CommonContentComponent,
    SearchBoxComponent,
    SearchBoxMComponent,
    MobileAppDownloadComponent,
    SitemapComponent,
    OnlinebusticketsComponent,
  ],
  imports: [
    NoopAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    NgbTypeaheadModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgbProgressbarModule,
    NgOptimizedImage,
    // AuthModule.forRoot({
    //   domain: 'dev-seofied.us.auth0.com',
    //   clientId: 'RsznkkMUqmJD0nUXjYv2LS8HPopT4xy1',
    //   httpInterceptor: {
    //     allowedList: ['*'] // Allow all requests to be intercepted
    //   },
    //   cacheLocation: 'localstorage' // Use localStorage for token storage
    // }),
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: false,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [AppInitializerService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppInitializerService]
    },
    { provide: NgbDateParserFormatter, useClass: CustomdateformatService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },

    JwtHelperService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
