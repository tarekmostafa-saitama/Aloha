import { Component, OnDestroy, OnInit } from '@angular/core';
import { TextChatHubService } from '../Shared/Hubs/text-chat-hub.service';

@Component({
  selector: "app-text-chat",
  templateUrl: "./text-chat.component.html",
  styleUrls: ["./text-chat.component.css"],
})
export class TextChatComponent implements OnInit, OnDestroy {
  constructor(private textChatHubService: TextChatHubService) {}

  ngOnInit(): void {
    this.registerToRandomChatQueue();
  }
  registerToRandomChatQueue = () => {
    if (this.textChatHubService.isConnected()) {
      this.textChatHubService.registerToRandomChatQueue();
    } else {
      
    }
  };
  ngOnDestroy(): void {}
}
