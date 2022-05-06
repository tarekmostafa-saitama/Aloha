import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Peer from "skyway-js";

@Injectable({
  providedIn: "root",
})
export class SkywayWebrtcService {
  peer;
  call;
  inCall: boolean;
  myStream: any;
  ringingAudio: any;

  myName: string;
  dataConnection: any;

  IsConntected: boolean;
  private Conntected = new Subject<boolean>(); // Source
  Conntected$ = this.Conntected.asObservable(); // Stream

  private MyStream = new Subject<any>(); // Source
  MyStream$ = this.MyStream.asObservable(); // Stream

  private RemoteStream = new Subject<any>(); // Source
  RemoteStream$ = this.RemoteStream.asObservable(); // Stream

  constructor() {}
  ConnectToPeerJs(peerId) {
    this.peer = null;
    const current = this;
    // establishing peer connection
    this.peer = new Peer(peerId, {
      key: "49854ef1-f643-45af-a75d-9f99c5c835d8",
    });

    // Begin main peer connection
    this.peer.on("open", function (id) {
      console.log("My peer ID is: " + id);
      current.Conntected.next(true);
      current.IsConntected = true;
    });
    
    // someone trying to establish a call
    this.peer.on("call", (call) => {
      // if i'm in a call send them busy
      if (this.inCall) {
        
      } else {
        // raise inCall flag and show a call
        this.inCall = true;
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            this.call = call;
             this.myStream = stream;
             this.MyStream.next(stream);

            this.call.answer(this.myStream); // Answer the call with an A/V stream.
            this.call.on("stream", (remoteStream) => {
              this.RemoteStream.next(remoteStream);
            });

            this.call.on("close", function () {
              current.inCall = false;
              //current.EndRecievingAudioCall.next(true);
            });
          }),
          // tslint:disable-next-line: no-unused-expression
          (err: any) => {
            console.error("Failed to get local stream", err);
          };
      }
    });
    this.peer.on("error", (error) => {
      console.log(`${error.type}: ${error.message}`);
      // => room-error: Room name must be defined.
      if (error.type == "unavailable-id") {
        setTimeout(() => {
          this.ConnectToPeerJs(peerId);
        }, 10000);
      }
    });
    //this.configureRingingTone();
  }

  makeCall(otherId) {
    const current = this;
    if (!this.inCall) {
      this.inCall = true;
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
        (stream) => {
          current.myStream = stream;
          this.MyStream.next(stream);
          current.call = this.peer.call(otherId, current.myStream, {
            // metadata: { callerName: current.myName },
          });
          // this.playRingingTone();
          current.call.on("stream", (remoteStream) => {
           this.RemoteStream.next(remoteStream);
          });

          // Handle when the call finishes
          current.call.on("close", function () {
            current.inCall = false;
            //current.EndAudioCall.next(true);
          });
        },
        (err) => {
          console.error("Failed to get local stream", err);
        }
      );
    }
  }

  videoCallEnding() {
    this.inCall = false;
    try {
      this.call.close();
    } catch (ex) {}
  }

  // tslint:disable-next-line: no-trailing-whitespace
  configureRingingTone() {
    this.ringingAudio = new Audio("../../../assets/ringing.mp3");
    this.ringingAudio.load();
    this.ringingAudio.loop = true;
  }
  playRingingTone() {
    this.ringingAudio.play();
  }
  stopRingingTone() {
    this.ringingAudio.pause();
    this.ringingAudio.currentTime = 0;
  }
}