import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BookingRoutingModule    
  ],
  exports: [],
  providers: [],
  bootstrap: [BookingComponent]
})
export class BookingModule { }