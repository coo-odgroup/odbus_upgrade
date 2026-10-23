import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QRCodeModule } from 'angularx-qrcode';
import { MatStepperModule } from '@angular/material/stepper';
import { CountdownModule } from 'ngx-countdown';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
@NgModule({
  declarations: [
    BookingComponent,
  ],
  imports: [
    RouterModule,
    NgSelectModule,
    AutocompleteLibModule,
    NgxSpinnerModule,
    QRCodeModule,
    MatStepperModule,
    CountdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BookingRoutingModule    
  ],
  exports: [],
  providers: [],
})
export class BookingModule { }