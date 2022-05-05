import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { TextChatComponent } from './text-chat/text-chat.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    UserLayoutComponent,
    TextChatComponent,
    VideoChatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule
  ]
})
export class UserModule { }
