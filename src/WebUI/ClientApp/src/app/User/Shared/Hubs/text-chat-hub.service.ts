import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { Subject } from "rxjs";
import { UserAuthService } from "src/app/Shared/Services/Auth/user-auth.service";
import { TextMessage } from "../Models/text-message";

@Injectable({
  providedIn: "root",
})
export class TextChatHubService {
  private hubConnection: HubConnection;
  private connectionUrl = "https://localhost:44312/textChat";
  private apiUrl = "https://localhost:44312/";

  private Connected = new Subject<boolean>(); // Source
  Connected$ = this.Connected.asObservable(); // Stream

  private ReceivedMessage = new Subject<TextMessage>(); // Source
  ReceivedMessage$ = this.ReceivedMessage.asObservable(); // Stream

  private UserPaired = new Subject<boolean>(); // Source
  UserPaired$ = this.UserPaired.asObservable(); // Stream

  private CurrentStatus = new Subject<string>(); // Source
  CurrentStatus$ = this.CurrentStatus.asObservable(); // Stream

  private OtherVideoConnectionId = new Subject<string>(); // Source
  OtherVideoConnectionId$ = this.OtherVideoConnectionId.asObservable(); // Stream

  constructor(private userAuthService: UserAuthService) {}

  public connect = () => {
    this.startConnection();
    this.addListeners();
  };
  public disConnect = () => {
    this.hubConnection.stop();
    console.log("connection closed");
  };
  public isConnected = () => {
    return (
      this.hubConnection &&
      this.hubConnection.state == signalR.HubConnectionState.Connected
    );
  };
  sendMessage(inputTextMessage: string) {
    this.hubConnection
      .invoke("RouteTextMessage", inputTextMessage)
      .catch((err) => console.log("error while sending to hub: " + err));
  }
  public registerToRandomChatQueue = () => {
    this.hubConnection
      .invoke("RegisterToQueue")
      .catch((err) => console.log("error while queueing to hub: " + err));
  };
  public unRegisterFromRandomChatQueue = () => {
    this.hubConnection
      .invoke("UnRegisterFromQueue")
      .catch((err) => console.log("error while queueing to hub: " + err));
  };
  registerToRandomVideoChatQueue() {
    this.hubConnection
      .invoke("RegisterToVideoQueue")
      .catch((err) => console.log("error while queueing to hub: " + err));
  }
  public unRegisterFromRandomVideoChatQueue = () => {
    this.hubConnection
      .invoke("UnRegisterFromVideoQueue")
      .catch((err) => console.log("error while queueing to hub: " + err));
  };

  public getConnectionId(): string {
    return this.hubConnection.connectionId;
  }
  private getConnection(): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(this.connectionUrl, {
        accessTokenFactory: () => this.userAuthService.getUserAccessToken(),
      })
      .withHubProtocol(new MessagePackHubProtocol())
      .configureLogging(LogLevel.Trace)
      .build();
  }
  private startConnection() {
    this.hubConnection = this.getConnection();

    this.hubConnection
      .start()
      .then(() => {
        this.Connected.next(true);
        console.log("connection started");
      })
      .catch((err) => {
        console.log("error while establishing signalr connection: " + err);
      });
  }

  private addListeners() {
    this.hubConnection.onclose((error) => {
      console.log("Error : " + error);
    });

    this.hubConnection.on("waitingRandomTextChat", () => {
      this.UserPaired.next(false);
      this.CurrentStatus.next("Waiting for available random stranger ...");
    });
    this.hubConnection.on("waitingRandomVideoChat", () => {
      this.UserPaired.next(false);
      this.CurrentStatus.next("Waiting for available random stranger ...");
    });

    this.hubConnection.on("setupRandomTextChat", () => {
      this.UserPaired.next(true);
      this.CurrentStatus.next("Conntected successfully to random stranger.");
    });
    this.hubConnection.on("setupRandomVideoChat", (connectionId, call) => {
      this.UserPaired.next(true);
      if(call)
      this.OtherVideoConnectionId.next(connectionId);
      this.CurrentStatus.next("Conntected successfully to random stranger.");
    });

    this.hubConnection.on("disconnectedRandomTextChat", () => {
      this.UserPaired.next(false);
      this.CurrentStatus.next(
        "Stranger has been disconnected, please click on refresh button to find another match."
      );
    });
    this.hubConnection.on("disconnectedRandomVideoChat", () => {
      this.UserPaired.next(false);
      this.CurrentStatus.next(
        "Stranger has been disconnected, please click on refresh button to find another match."
      );
    });
    this.hubConnection.on("receiveTextMessage", (message: TextMessage) => {
      console.log(message);
      this.ReceivedMessage.next(message);
    });
  }
}
