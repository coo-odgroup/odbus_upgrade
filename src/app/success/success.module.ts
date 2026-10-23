import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QRCodeModule } from 'angularx-qrcode';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuccessRoutingModule } from './success-routing.module';
import { SuccessComponent } from './success.component';
@NgModule({
  declarations: [
    SuccessComponent,
  ],
  imports: [
    RouterModule,
    NgSelectModule,
    AutocompleteLibModule,
    NgxSpinnerModule,
    QRCodeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SuccessRoutingModule    
  ],
  exports: [],
  providers: [],
})
export class SuccessModule { }