import { Component, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { SkywayWebrtcService } from "../Shared/Hubs/skyway-webrtc.service";
import { TextChatHubService } from "../Shared/Hubs/text-chat-hub.service";

@Component({
  selector: "app-video-chat",
  templateUrl: "./video-chat.component.html",
  styleUrls: ["./video-chat.component.css"],
})
export class VideoChatComponent implements OnInit {
  ConnectedSubscribtion: Subscription;
  CurrentStatusSubscribition: Subscription;
  IsPairedSubscribition: Subscription;
  OtherVideoConnectionIdSubscription: Subscription;

  MyStreamSubscribtion: Subscription;

  IsPaired: boolean;
  CurrentStatus: string;

  @ViewChild("myVideo") MyVideo: any;
  @ViewChild("remoteVideo") RemoteVideo: any;

  constructor(
    private skywayWebrtcService: SkywayWebrtcService,
    private textChatHubService: TextChatHubService
  ) {}

  ngOnInit(): void {
    this.registerToRandomChatQueue();
  }
  registerToRandomChatQueue = () => {
    if (this.textChatHubService.isConnected()) {
      if (this.skywayWebrtcService.IsConntected) {
        this.textChatHubService.registerToRandomVideoChatQueue();
        this.registerSubscriptions();
      } else {
        this.skywayWebrtcService.Conntected$.subscribe((x) => {
          if (x) {
            this.textChatHubService.registerToRandomVideoChatQueue();
            this.registerSubscriptions();
          }
        });
      }
    } else {
      this.ConnectedSubscribtion = this.textChatHubService.Connected$.subscribe(
        (x) => {
          if (x) {
            if (this.skywayWebrtcService.IsConntected) {
              this.textChatHubService.registerToRandomVideoChatQueue();
              this.registerSubscriptions();
            } else {
              this.skywayWebrtcService.Conntected$.subscribe((z) => {
                if (z) {
                  this.textChatHubService.registerToRandomVideoChatQueue();
                  this.registerSubscriptions();
                }
              });
            }
          }
        }
      );
    }
  };

  registerSubscriptions() {
    this.IsPairedSubscribition = this.textChatHubService.UserPaired$.subscribe(
      (x) => {
        this.IsPaired = x;
      }
    );
    this.CurrentStatusSubscribition =
      this.textChatHubService.CurrentStatus$.subscribe((x) => {
        this.CurrentStatus = x;
      });
    this.OtherVideoConnectionIdSubscription =
      this.textChatHubService.OtherVideoConnectionId$.subscribe((x) => {
        this.skywayWebrtcService.makeCall(x);
      });
    this.skywayWebrtcService.MyStream$.subscribe((x) => {
      this.MyVideo.nativeElement.srcObject = x;
    });
    this.skywayWebrtcService.RemoteStream$.subscribe((x) => {
      console.log(x);
      this.RemoteVideo.nativeElement.srcObject = x;

      //  this.RemoteVideo.play();
    });
  }
  unRegisterSubscriptions() {
    //this.IsPairedSubscribition.unsubscribe();
    this.CurrentStatusSubscribition.unsubscribe();
    this.OtherVideoConnectionIdSubscription.unsubscribe();
  }

  refreshStranger(){

    if (this.IsPaired) 
      {
        this.skywayWebrtcService.videoCallEnding();
        this.textChatHubService.unRegisterFromRandomVideoChatQueue();
      }
    this.textChatHubService.registerToRandomVideoChatQueue();
  }

  ngOnDestroy(): void {
    this.ConnectedSubscribtion.unsubscribe();
    this.unRegisterSubscriptions();
    this.textChatHubService.unRegisterFromRandomVideoChatQueue();
  }
}
