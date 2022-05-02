import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtTokenStorageService } from 'src/app/Shared/Services/Auth/jwt-token-storage.service';
import { UserAuthService } from 'src/app/Shared/Services/Auth/user-auth.service';
import { ToasterService } from 'src/app/Shared/Services/toaster.service';
import { LoginUserRequest } from 'src/app/web-api-client';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  constructor(
    private userAuthService: UserAuthService,
    private jwtTokenStorageService: JwtTokenStorageService,
    private toastrService: ToasterService,
    private router: Router
  ) {

  
  }
  signinForm: FormGroup;
  ngOnInit(): void {
     this.signinForm = new FormGroup({
       email: new FormControl("", [Validators.email, Validators.required]),
       password: new FormControl("", [Validators.required]),
     });
  }

  login() {
    this.userAuthService
      .login(
        new LoginUserRequest({
          email: this.signinForm.value.email,
          password: this.signinForm.value.password
        })
      )
      .subscribe((x) => {
        if(x.isSuccess){
          this.jwtTokenStorageService.SetAuthTokens(x);
          this.userAuthService.startRefreshTokenTimer();

          this.toastrService.Success("","Success Login Proccess");
          this.router.navigate(["/user/home"]);
        }else{
          this.errorMessage = x.error;
          this.toastrService.Error("", "Failed Login Proccess");
        }
      });
  }
}
