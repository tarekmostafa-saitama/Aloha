import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoggedInGuard } from '../Shared/Guards/user-logged-in.guard';
import { HomeComponent } from './home/home.component';
import { TextChatComponent } from './text-chat/text-chat.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { VideoChatComponent } from './video-chat/video-chat.component';

const routes: Routes = [
  {
    path: "user",
    component: UserLayoutComponent,
    children: [
      {
        path: "home",
        component: HomeComponent,
        canActivate: [UserLoggedInGuard],
      },
      {
        path: "text",
        component: TextChatComponent,
        canActivate: [UserLoggedInGuard],
      },
      {
        path: "video",
        component: VideoChatComponent,
        canActivate: [UserLoggedInGuard],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
