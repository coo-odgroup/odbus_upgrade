import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-operators',
  templateUrl: './top-operators.component.html',
  styleUrls: ['./top-operators.component.css', '../home.component.css']
})
export class TopOperatorsComponent implements OnInit {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  topOperators: any = [];
  displayedOperators: any = [];
  showAllOperators = false;
  isMobile = false;

  ngOnInit(): void {
    // Browser globals are unavailable while Angular renders on the server.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isMobile = window.innerWidth <= 768;

    try {
      const data = localStorage.getItem('PopularInfo');

      if (data) {
        const parsedData = JSON.parse(data);

        if (parsedData && parsedData.topOperators) {
          this.topOperators = parsedData.topOperators;

          this.displayedOperators = this.isMobile
            ? this.topOperators.slice(0, 5)
            : this.topOperators;
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage data', error);
    }
  }

  viewAllOperators() {
    this.showAllOperators = true;
    this.displayedOperators = this.topOperators;
  }

  operator_detail(url: any) {
    if (url != '') {
      this.router.navigate(['operators/' + url]);
    }
  }

}
