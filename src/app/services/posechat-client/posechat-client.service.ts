import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PosechatClientService {
    public url = 'http://localhost:3000';
    private socket;
    public isConnected = false;

    // send posenet data
    private sendTimeBuf = 0;
    private sendRequestId;
    public sendInterval = 33;   // ms
    public isSending = false;
    public poseInput;
    public poseInputBuf;
    public namespace = "ladida";
    public isReceiving = false;
    public subReceiverState = new Subject<boolean>();
    public subReceivedPose = new Subject<JSON>();


    constructor() {
        //this.socket = io(this.url);
    }

    public toggleConnect() {

        // if socket doesnt exist or url has changed
        if (!this.socket || this.socket.io.uri != this.url) {

            // close old socket
            if (this.socket) {
                this.socket.close();
            }

            // create new socket
            this.socket = io(this.url);

            this.socket.on("connect_failed", e => {
                console.log("connecting failed ...");
                this.socket.close();
            });

            this.socket.on("connect_error", e => {
                console.log("connection error ...");
                this.socket.close();
            });

            this.socket.on('connect', e => {
                console.log("connected ...\nuri: "+this.socket.io.uri+" \n id: " + this.socket.id);
                this.isConnected = true;
                //this.startSending();
            });

            this.socket.on('disconnect', e => {
                console.log("disonnected ...");
                this.isConnected = false;
                this.stopSending();
                this.stopReceiving();
            });

            this.socket.on('pose-data', msg => {
                if(this.isReceiving) {
                    //console.log("message: " + msg);
                    this.subReceivedPose.next(msg);
                }
            })



        }else  {
            if (this.socket.connected) {
                this.socket.disconnect();
            } else {
                this.socket.connect();
            }
        }
    }

    public toggleSending() {
        if (this.isConnected) {
            if (this.isSending) {
                this.stopSending();
            } else {
                this.startSending();
            }
        }
    }

    public startSending(){
        this.isSending = true;
        this.sendLoop();
    }

    public stopSending(){
        this.isSending = false;
    }

    private sendLoop() {
        if (this.isSending) {
            const now = Date.now();
            const t = now - this.sendTimeBuf;

            // send at 30Hz
            if (t >= this.sendInterval) {
                this.send();
                this.sendTimeBuf = now;
            }

            // new frame
            this.sendRequestId = requestAnimationFrame(() => this.sendLoop());
        }
    }

    private send() {
        // only send if poseInput is not empty AND if its timestamp changed
        if (this.poseInput) {
            if(!this.poseInputBuf || (this.poseInput.timestamp != this.poseInputBuf.timestamp)) {
                //console.log("pose-data: " + this.poseInput.timestamp);
                let json = this.poseInput;
                //let jsonStr = JSON.stringify(json);

                // TODO: send to all bois in namespace (except sender)
                //this.socket.emit("pose-data", jsonStr);
                // for now... broadcast
                this.socket.emit('pose-data', json);
            }
            this.poseInputBuf = this.poseInput;
        }

    }



    public toggleReceiving() {
        if (this.isConnected) {
            if (this.isReceiving) {
                this.stopReceiving();
            } else {
                this.startReceiving();
            }
        }
    }

    public startReceiving(){
        this.isReceiving = true;
        this.subReceiverState.next(true);
    }

    public stopReceiving(){
        this.isReceiving = false;
        this.subReceiverState.next(false);
    }

}
