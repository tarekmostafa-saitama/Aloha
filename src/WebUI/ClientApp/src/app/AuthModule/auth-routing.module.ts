import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserNotLoggedInGuard } from '../Shared/Guards/user-not-logged-in.guard';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  
  {
    path: "",
    component: LoginComponent,
    canActivate: [UserNotLoggedInGuard],
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [UserNotLoggedInGuard],
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [UserNotLoggedInGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
