import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TopOperatorsService } from '../services/top-operators.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css'],
})
export class OperatorsComponent {
  allOperators: any;
  currentUrl: string;

  per_page = 400;
  searchText: string = '';

  constructor(
    private spinner: NgxSpinnerService,
    private topOperatorsService: TopOperatorsService,
    private router: Router,
    private seo: SeoService,
    location: Location,
  ) {
    this.getList();

    this.currentUrl = location.path().replace('/', '');
    this.seo.seolist(this.currentUrl);
  }

  operator_detail(url: any) {
    if (url != '') {
      this.router.navigate(['operators/' + url]);
    }
  }

  getList(url: any = '', filter: any = '') {
    this.spinner.show();
    const param = {
      paginate: this.per_page,
      filter: filter,
    };

    this.topOperatorsService.allOperator(url, param).subscribe(
      (res) => {
        if (res.status == 1) {
          this.allOperators = res.data.data;
        }

        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      },
    );
  }

  onSearchChange() {
    const value = this.searchText.trim();
    const firstPageUrl = this.allOperators?.first_page_url ?? '';

    // only call when 3+ letters
    if (value.length >= 3) {
      this.getList(firstPageUrl, value);
    }

    // load default data when cleared
    else if (value.length === 0) {
      this.getList(firstPageUrl, '');
    }
  }
}
