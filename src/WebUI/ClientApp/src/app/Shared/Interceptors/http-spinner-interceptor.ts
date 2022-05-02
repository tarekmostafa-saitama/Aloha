import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class HttpSpinnerInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
   this.spinner.show();

     return (
       next
         .handle(request)
         .pipe(
           finalize(() => { 
             this.spinner.hide();
           })
         )
     );
  }
}
