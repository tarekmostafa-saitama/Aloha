import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { JwtTokenStorageService } from "../Services/Auth/jwt-token-storage.service";
import { UserAuthService } from "../Services/Auth/user-auth.service";


@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
  constructor(private userAuthService: UserAuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if account is logged in and request is to the api url
    const token = this.userAuthService.getUserAccessToken();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request);
  }
}
