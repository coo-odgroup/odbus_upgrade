
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

import { OfferService } from '../services/offer.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { LoginChecker } from '../helpers/loginChecker';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
})
export class OffersComponent implements OnInit {

  allOffers: any[] = [];

  url_path = '';
  currentUrl: any;

  session: LoginChecker;

  MenuActive = false;
  OfferData: any = null;

  showOfferModal = false;
  fragmentValue: string | null = null;

  constructor(
    private spinner: NgxSpinnerService,
    private offerService: OfferService,
    private router: Router,
    private seo: SeoService,
    private location: Location,
    private route: ActivatedRoute,
    private notify: NotificationService,
  ) {
    this.session = new LoginChecker();

    this.currentUrl = this.location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  ngOnInit(): void {

    // URL fragment subscription
    this.route.fragment.subscribe((fragment) => {
      this.fragmentValue = fragment;
      this.checkAndOpenOffer();
    });

    // Load offers from API
    this.loadOffers();
  }

  checkAndOpenOffer(): void {

    if (!this.fragmentValue || !this.allOffers?.length) {
      return;
    }

    const index = this.allOffers.findIndex(
      (offer: any) =>
        offer.coupon?.coupon_code === this.fragmentValue ||
        offer.unique_id === this.fragmentValue
    );

    if (index !== -1) {
      this.openOffer(index);
    }
  }

  loadOffers(): void {

    this.spinner.show();

    const param = {
      user_id: GlobalConstants.MASTER_SETTING_USER_ID,
    };

    this.offerService.Offers(param).subscribe(
      (res: any) => {

        if (res.status == 1 && res.data) {

          this.allOffers = res.data;

          localStorage.setItem(
            'offerData',
            JSON.stringify(res.data)
          );

          // Check URL fragment after offers are loaded
          this.checkAndOpenOffer();
        }

        this.spinner.hide();
      },
      (err: any) => {

        console.error('Offer API error:', err);

        this.spinner.hide();
      }
    );
  }

  menu(): void {
    this.MenuActive = true;
  }

  signOut(): void {
    this.session.logout();
    this.router.navigate(['login']);
  }

  openOffer(index: number): void {

    if (!this.allOffers || !this.allOffers[index]) {
      return;
    }

    this.OfferData = this.allOffers[index];
    this.showOfferModal = true;
  }

  closeOfferModal(): void {

    this.showOfferModal = false;
    this.OfferData = null;

    this.router.navigate(['offers']);
  }

  copyCoupon(code: string): void {

    if (!code) {

      this.notify.notify(
        'No coupon code available to copy.',
        'Error'
      );

      this.closeOfferModal();
      return;
    }

    navigator.clipboard
      .writeText(code)
      .then(() => {

        this.router.navigate(['offers']);

        this.notify.notify(
          'Coupon copied!',
          'Success'
        );

        this.closeOfferModal();
      })
      .catch((err) => {

        console.error('Copy failed:', err);

        this.notify.notify(
          'Failed to copy coupon.',
          'Error'
        );
      });
  }

}
