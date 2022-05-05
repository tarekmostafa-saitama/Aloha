import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { TextChatHubService } from "../Shared/Hubs/text-chat-hub.service";
import { TextMessage, TextMessageType } from "../Shared/Models/text-message";

@Component({
  selector: "app-text-chat",
  templateUrl: "./text-chat.component.html",
  styleUrls: ["./text-chat.component.css"],
})
export class TextChatComponent implements OnInit, OnDestroy {
  ConnectedSubscribtion: Subscription;
  CurrentStatusSubscribition: Subscription;
  ReceivedMessageSubscribtion: Subscription;
  IsPairedSubscribition: Subscription;
  TextMessages: TextMessage[];
  InputTextMessage: string;
  IsPaired: boolean;
  CurrentStatus: string;

  constructor(private textChatHubService: TextChatHubService) {
    this.TextMessages = [];
    this.CurrentStatus = "Waiting for available random stranger ...";
  }

  ngOnInit(): void {
    this.registerToRandomChatQueue();
  }
  registerToRandomChatQueue = () => {
    if (this.textChatHubService.isConnected()) {
      this.textChatHubService.registerToRandomChatQueue();
      this.registerSubscriptions();
    } else {
      this.ConnectedSubscribtion = this.textChatHubService.Connected$.subscribe(
        (x) => {
          if (x) {
            this.textChatHubService.registerToRandomChatQueue();
            this.registerSubscriptions();
          }
        }
      );
    }
  };
  registerSubscriptions() {
    this.ReceivedMessageSubscribtion =
      this.textChatHubService.ReceivedMessage$.subscribe((x) => {
        this.TextMessages.push(x);
      });

    this.IsPairedSubscribition = this.textChatHubService.UserPaired$.subscribe(
      (x) => {
        this.IsPaired = x;
      }
    );
    this.CurrentStatusSubscribition =
      this.textChatHubService.CurrentStatus$.subscribe((x) => {
        this.CurrentStatus = x;
      });
  }
  unRegisterSubscriptions() {
    this.ReceivedMessageSubscribtion.unsubscribe();
    this.IsPairedSubscribition.unsubscribe();
    this.CurrentStatusSubscribition.unsubscribe();
  }
  ngOnDestroy(): void {
    this.ConnectedSubscribtion.unsubscribe();
    this.unRegisterSubscriptions();
    this.textChatHubService.unRegisterFromRandomChatQueue();
  }

  sendMessage() {
    if (!this.InputTextMessage.trim()) return false;
    this.textChatHubService.sendMessage(this.InputTextMessage);
    var message = new TextMessage();
    message.TextMessage = this.InputTextMessage;
    message.Type = TextMessageType.Me;
    this.TextMessages.push(message);
    this.InputTextMessage = "";
  }
  refreshStranger(){
    if(this.IsPaired)
      this.textChatHubService.unRegisterFromRandomChatQueue();
    this.textChatHubService.registerToRandomChatQueue();
  }
}
