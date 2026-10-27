import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-app-download',
  templateUrl: './mobile-app-download.component.html',
  styleUrls: ['./mobile-app-download.component.css']
})
export class MobileAppDownloadComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
