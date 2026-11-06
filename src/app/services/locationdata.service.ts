import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError, finalize, shareReplay } from 'rxjs/operators';
import{ GlobalConstants } from '../constants/global-constants';

@Injectable({
  providedIn: 'root'
})
export class LocationdataService {

  private apiURL = GlobalConstants.BASE_URL;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
    
    private source = new  BehaviorSubject('');
    private destination = new  BehaviorSubject('');
    private source_id = new  BehaviorSubject('');
    private destination_id = new  BehaviorSubject('');
    private entdate = new  BehaviorSubject('');
    

  constructor(private httpClient: HttpClient) { 
  }

  currentsource = this.source.asObservable();
  currentdestination = this.destination.asObservable();
  currentsource_id = this.source_id.asObservable();
  currentdestination_id = this.destination_id.asObservable();
  currententdate = this.entdate.asObservable();

    setSource(s: any) {

       this.source.next(s);
    }

    setDestination(d: any) {
      this.destination.next(d);
    }

    setDate(dat: any) {
      this.entdate.next(dat);
    }

  

  // Share one in-flight request per search value so parallel callers don't hit the API twice
  private locationInflight = new Map<string, Observable<any>>();

  all(val :any=''): Observable<any> {
    const key = String(val);
    const existing = this.locationInflight.get(key);
    if (existing) { return existing; }
    const req$ = this.httpClient.get<any>(this.apiURL + '/getLocation?locationName=' + val,  this.httpOptions)
    .pipe(
      catchError(this.errorHandler),
      finalize(() => this.locationInflight.delete(key)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.locationInflight.set(key, req$);
    return req$;
  }

  errorHandler(error:HttpErrorResponse) {
    let errorMessage :any;
    if(error.error instanceof HttpErrorResponse) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error;
      
      //`Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}
