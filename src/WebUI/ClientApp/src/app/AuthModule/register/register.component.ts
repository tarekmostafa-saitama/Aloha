import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtTokenStorageService } from 'src/app/Shared/Services/Auth/jwt-token-storage.service';
import { UserAuthService } from 'src/app/Shared/Services/Auth/user-auth.service';
import { ToasterService } from 'src/app/Shared/Services/toaster.service';
import { RegisterUserRequest, Role } from 'src/app/web-api-client';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  errorMessage: string;
  constructor(
    private userAuthService: UserAuthService,
    private jwtTokenStorageService: JwtTokenStorageService,
    private toastrService: ToasterService,
    private router: Router
  ) {}
  signupForm: FormGroup;
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      fullName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }

  register() {
    this.userAuthService
      .register(
        new RegisterUserRequest({
          fullName: this.signupForm.value.fullName,
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
          role: Role.User
        })
      )
      .subscribe((x) => {
        if (x.isSuccess) {
          this.jwtTokenStorageService.SetAuthTokens(x);
          this.userAuthService.startRefreshTokenTimer();
          this.toastrService.Success("", "Success Register Proccess");
          this.router.navigate(["/user/home"]);
        } else {
          this.errorMessage = x.error;
          this.toastrService.Error("", "Failed Register Proccess");
        }
      });
  }
}
