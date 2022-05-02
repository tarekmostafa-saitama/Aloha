import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountClient, AuthenticateResponse, LoginUserRequest, RefreshRequest, RegisterUserRequest } from 'src/app/web-api-client';
import { JwtTokenStorageService } from './jwt-token-storage.service';

@Injectable({
  providedIn: "root",
})
export class UserAuthService {
  constructor(
    private jwtTokenStorageService: JwtTokenStorageService,
    private accountClient: AccountClient
  ) {}

  public getUserAccessToken(): string {
    return this.jwtTokenStorageService.jwtLoggedToken;
  }
  public getUserRefreshToken(): string {
    return this.jwtTokenStorageService.jwtRefreshToken;
  }
  public login(model: LoginUserRequest): Observable<AuthenticateResponse> {
    return this.accountClient.getToken(model);
  }
  public refreshToken(): Observable<AuthenticateResponse> {
    var command = new RefreshRequest();
    command.refreshToken = this.getUserRefreshToken();
    return this.accountClient.refreshToken(command);
  }
  public logout(): void {
    this.jwtTokenStorageService.ClearUserData();
  }
  public register(
    model: RegisterUserRequest
  ): Observable<AuthenticateResponse> {
    return this.accountClient.register(model);
  }

  // helper methods

  private refreshTokenTimeout;

  public startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.getUserAccessToken().split(".")[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
