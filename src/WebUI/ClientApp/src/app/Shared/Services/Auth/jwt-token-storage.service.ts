import { Injectable } from "@angular/core";
import { AuthenticateResponse } from "src/app/web-api-client";

@Injectable({
  providedIn: "root",
})
export class JwtTokenStorageService {
  jwtLoggedToken: string;
  jwtRefreshToken: string;

  constructor() {
    this.SetupAuthTokens();
  }

  public SetAuthTokens(tokenResponse: AuthenticateResponse): void {
    localStorage.setItem("access-token", tokenResponse.accessToken);
    localStorage.setItem("refresh-token", tokenResponse.refreshToken);
    this.SetupAuthTokens();
  }
  public ClearUserData() {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    this.SetupAuthTokens();
  }
  private SetupAuthTokens() {
    this.jwtLoggedToken = localStorage.getItem("access-token");
    this.jwtRefreshToken = localStorage.getItem("refresh-token");
  }
}
