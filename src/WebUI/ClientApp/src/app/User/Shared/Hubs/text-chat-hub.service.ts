import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { UserAuthService } from "src/app/Shared/Services/Auth/user-auth.service";

@Injectable({
  providedIn: "root",
})
export class TextChatHubService {
  private hubConnection: HubConnection;
  private connectionUrl = "https://localhost:44312/textChat";
  private apiUrl = "https://localhost:44312/";

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
      .then(() => console.log("connection started"))
      .catch((err) => {
        console.log("error while establishing signalr connection: " + err);
      });
  }

  private addListeners() {
    
    this.hubConnection.onclose((error) => {
      console.log("Error : " + error);
    });

    this.hubConnection.on("waitingRandomTextChat", () => {
      console.log("message received from Hub");
    });

    this.hubConnection.on("setupRandomTextChat", () => {
      console.log("message received from Hub");
    });

    this.hubConnection.on("disconnectedRandomTextChat", () => {
      console.log("message received from Hub");
    });
  }
}
