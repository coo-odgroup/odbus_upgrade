import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LightboxModule } from 'ngx-lightbox';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchRoutingModule } from './search-routing.module';
@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [
    RouterModule,
    NgSelectModule,
    AutocompleteLibModule,
    NgxSpinnerModule,
    LightboxModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SearchRoutingModule    
  ],
  exports: [],
  providers: [],
})
export class SearchModule { }