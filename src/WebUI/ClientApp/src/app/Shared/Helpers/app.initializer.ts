import { JwtTokenStorageService } from "../Services/Auth/jwt-token-storage.service";
import { UserAuthService } from "../Services/Auth/user-auth.service";

export function appInitializer(userAuthService: UserAuthService, jwtTokenStorageService: JwtTokenStorageService) {
  return () =>
    new Promise((resolve) => {
      // attempt to refresh token on app start up to auto authenticate
      userAuthService.refreshToken().subscribe(x=>{
          if(x.isSuccess)
            {
                jwtTokenStorageService.SetAuthTokens(x);  
                userAuthService.startRefreshTokenTimer();
            }     
      }).add(resolve);
    });
}
