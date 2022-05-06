import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/Shared/Services/Auth/user-auth.service';
import { SkywayWebrtcService } from '../Shared/Hubs/skyway-webrtc.service';
import { TextChatHubService } from '../Shared/Hubs/text-chat-hub.service';

@Component({
  selector: "app-user-layout",
  templateUrl: "./user-layout.component.html",
  styleUrls: ["./user-layout.component.css"],
})
export class UserLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private textChatHubService: TextChatHubService,
    private skywayWebrtcService: SkywayWebrtcService
  ) {}

  ngOnInit(): void {
       this.textChatHubService.Connected$.subscribe((x) => {
        this.skywayWebrtcService.ConnectToPeerJs(this.textChatHubService.getConnectionId());
       });
    this.textChatHubService.connect();
 
  }
  ngOnDestroy(): void {
    this.textChatHubService.disConnect();
  }
  logout(): void {
    this.userAuthService.logout();
    this.router.navigateByUrl("/login");
  }
}
