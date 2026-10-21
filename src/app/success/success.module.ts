import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuccessRoutingModule } from './success-routing.module';
import { SuccessComponent } from './success.component';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SuccessRoutingModule    
  ],
  exports: [],
  providers: [],
  bootstrap: [SuccessComponent]
})
export class SuccessModule { }