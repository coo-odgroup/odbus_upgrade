import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
  UrlMatchResult,
  UrlSegment,
} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageErrorComponent } from './page-error/page-error.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { AuthGuard } from './helpers/auth.guard';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ProfiledeleteComponent } from './profiledelete/profiledelete.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { CommonContentComponent } from './common-content/common-content.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { OnlinebusticketsComponent } from './onlinebustickets/onlinebustickets.component';


const userRoutePaths = [
  'wallet',
  'dashboard',
  'notifications',
  'invite-friend',
  'rewards',
  'my-reviews',
  'helpandsupport',
  'myaccount',
];

export function userRouteMatcher(
  segments: UrlSegment[],
): UrlMatchResult | null {
  if (segments.length > 0 && userRoutePaths.includes(segments[0].path)) {
    return { consumed: [] };
  }

  return null;
}

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'index.php', redirectTo: '', pathMatch: 'full' },
  { path: 'index.html', redirectTo: '', pathMatch: 'full' },
  {
    path: 'about-us',
    loadChildren: () =>
      import('./about-us/about-us.module').then((m) => m.AboutUsModule),
  },
  {
    path: 'operators',
    loadChildren: () =>
      import('./operators/operators.module').then((m) => m.OperatorsModule),
  },
  {
    path: 'routes/:slug',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'routes',
    loadChildren: () =>
      import('./routes/routes.module').then((m) => m.RoutesModule),
  },
  {
    path: 'offers',
    loadChildren: () =>
      import('./offers/offers.module').then((m) => m.OffersModule),
  },
  {
    path: 'testimonials',
    loadChildren: () =>
      import('./testimonials/testimonials.module').then(
        (m) => m.TestimonialsModule,
      ),
  },
  {
    path: 'careers',
    loadChildren: () =>
      import('./careers/careers.module').then((m) => m.CareersModule),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('./contact-us/contact-us.module').then((m) => m.ContactUsModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('./tnc/tnc.module').then((m) => m.TncModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule,
      ),
  },
  {
    path: 'cancelation-policy',
    loadChildren: () =>
      import('./refund-policy/refund-policy.module').then(
        (m) => m.RefundPolicyModule,
      ),
  },
  {
    path: '404',
    loadChildren: () =>
      import('./page-error/page-error.module').then((m) => m.PageErrorModule),
  },
  {
    path: 'thank-you',
    loadChildren: () =>
      import('./thankyou/thankyou.module').then((m) => m.ThankyouModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then((m) => m.OtpModule),
  },
  {
    path: 'thankyou',
    component: ThankyouComponent,
  },
  {
    path: 'api-reference',
    loadChildren: () => import('./api/api.module').then((m) => m.ApiModule),
  },
  {
    path: 'maintenance',
    loadChildren: () =>
      import('./maintenance/maintenance.module').then(
        (m) => m.MaintenanceModule,
      ),
  },
  {
    matcher: userRouteMatcher,
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard],
  },
  { path: 'profile/delete', component: ProfiledeleteComponent },
  { path: 'payment-status', component: PaymentStatusComponent },
  {
    path: 'advantage/:slug',
    component: CommonContentComponent,
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./bloglisting/blog.module').then((m) => m.BlogModule),
  },
  {
    path: 'sitemap',
    component: SitemapComponent,
  },
  {
    path: 'online-bus-tickets',
    component: OnlinebusticketsComponent,
  },
  {
    path: 'pnr/:id',
    loadChildren: () =>
      import('./pnrdetail/pnrdetail.module').then((m) => m.PnrDetailsModule)
  },
  {
    path: 'success',
    loadChildren: () =>
      import('./success/success.module').then((m) => m.SuccessModule),
  },
  {
    path: 'booking',
    loadChildren: () =>
      import('./booking/booking.module').then((m) => m.BookingModule),
  },
  { path: '**', component: PageErrorComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class AppRoutingModule {
  currentUrl: any;

  constructor() { }
}
