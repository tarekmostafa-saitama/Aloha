import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { UserAuthService } from "../Services/Auth/user-auth.service";
@Injectable({
  providedIn: "root",
})
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private userService: UserAuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((err) => this.handleErrorReq(err)));
  }
  private handleErrorReq(err: HttpErrorResponse): Observable<never> {
    switch (err.status) {
      case 401:
        this.userService.logout();
        this.router.navigateByUrl("/login");
        break;

      case 403:
        this.userService.logout();
        this.router.navigateByUrl("/login");
        break;

      case 500:
        break;
    }

    return throwError(err);
  }
}

function throwError(err: HttpErrorResponse): Observable<never>
{
  console.log(err);
    throw new Error("Function not implemented.");
}
