
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../services/notification.service';
import { ContactService } from '../services/contact.service';
import { GlobalConstants } from '../constants/global-constants';
import { SeoService } from '../services/seo.service';
import { Location } from '@angular/common';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  currentUrl: string;

  @Input() masterSettingRecord: any;

  captchaText = '';

  constructor(
    public router: Router,
    public fb: FormBuilder,
    private contactService: ContactService,
    private notify: NotificationService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private location: Location,
    private commonService: CommonService,
  ) {
    this.currentUrl = this.location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      service: ['', Validators.required],
      message: ['', Validators.required],
      user_id: [GlobalConstants.MASTER_SETTING_USER_ID],
      captcha: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.masterSettingRecord = this.commonService.commonData;
    this.generateCaptcha();
  }

  get f() {
    return this.contactForm.controls;
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const e = event as KeyboardEvent & {
      which?: number;
      keyCode?: number;
    };

    const charCode = e.which || e.keyCode || 0;

    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 96 && charCode <= 105) ||
      [8, 9, 37, 39, 46].includes(charCode) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return true;
    }

    return false;
  }

  generateCaptcha(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.captchaText = result;

    // Clear an old captcha entry when a new captcha is generated.
    this.contactForm.patchValue({ captcha: '' });
  }

  formSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const enteredCaptcha = String(
      this.contactForm.value.captcha || '',
    ).trim().toUpperCase();

    if (!enteredCaptcha) {
      this.notify.notify('Please enter captcha', 'Error');
      return;
    }

    if (enteredCaptcha !== this.captchaText) {
      this.notify.notify('Invalid captcha', 'Error');
      this.generateCaptcha();
      return;
    }

    this.spinner.show();

    this.contactService.save(this.contactForm.value).subscribe({
      next: (res) => {
        this.spinner.hide();

        if (res.status === 1) {
          this.contactForm.reset({
            name: '',
            email: '',
            phone: '',
            service: '',
            message: '',
            user_id: GlobalConstants.MASTER_SETTING_USER_ID,
            captcha: '',
          });

          this.submitted = false;
          this.generateCaptcha();
          this.router.navigate(['thankyou']);
        } else {
          this.notify.notify(res.message, 'Error');
        }
      },
      error: (error) => {
        this.spinner.hide();

        this.notify.notify(
          error?.error?.message || 'Something went wrong',
          'Error',
        );
      },
    });
  }
}
