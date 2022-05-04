import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ModalModule } from "ngx-bootstrap/modal";
import { AppRoutingModule } from "./app-routing.module";

import { JwtTokenInterceptor } from "./Shared/Interceptors/jwt-token-interceptor";
import { ErrorHandlingInterceptor } from "./Shared/Interceptors/error-handling-interceptor";
import { AuthModule } from "./AuthModule/auth.module";
import { API_BASE_URL } from "./web-api-client";
import { NgxSpinnerModule } from "ngx-spinner";
import { HttpSpinnerInterceptor } from "./Shared/Interceptors/http-spinner-interceptor";
import { ToastrModule } from "ngx-toastr";
import { appInitializer } from "./Shared/Helpers/app.initializer";
import { UserAuthService } from "./Shared/Services/Auth/user-auth.service";
import { JwtTokenStorageService } from "./Shared/Services/Auth/jwt-token-storage.service";
import { UserModule } from "src/app/User/user.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    AuthModule,
    UserModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
  ],
  providers: [
     { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [UserAuthService, JwtTokenStorageService] },
    {
      provide: API_BASE_URL,
      useFactory: () => {
        return "https://localhost:44312";
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpSpinnerInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
