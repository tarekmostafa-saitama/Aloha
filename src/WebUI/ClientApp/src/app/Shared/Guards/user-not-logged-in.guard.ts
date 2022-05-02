import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from '../Services/Auth/user-auth.service';

@Injectable({
  providedIn: "root",
})
export class UserNotLoggedInGuard implements CanActivate {
  constructor(
    private router: Router,
    private userAuthService: UserAuthService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
       const token = this.userAuthService.getUserAccessToken();
       if (token) {
         // logged in so redirect to home page
         this.router.navigate(["/user/home"]);
         return false;
       }

       return true;
  }
}
