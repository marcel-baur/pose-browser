/// <reference types="@types/dom-mediacapture-record" />
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

declare const navigator: any;

@Injectable()
export class MediaRecordingService {

  private recordingCameraOptions = {
    audioBitsPerSecond : 128000,
    videoBitsPerSecond : 2500000
  };

  private mediaStreamCamera;
  private mediaRecorderCamera;

  constructor() {
  }

  public requestCameraRecordingPermission(cameraElement): Observable<boolean> {
    return new Observable((observable) => {
      return navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((stream) => {
          this.mediaStreamCamera = stream;
          this.onCameraStreamAvailable(stream, cameraElement);
          observable.next(true);
        },
        (err) => {
          console.error(err);
          observable.next(false);
        });
    });
  }

  public onCameraStreamAvailable(stream, cameraElement) {
    this.mediaRecorderCamera = new MediaRecorder(stream);
    cameraElement.nativeElement.srcObject = stream;
  }

  public startRecordingCamera(ondataavailable) {
    this.mediaRecorderCamera.start();
    if(ondataavailable){
      this.mediaRecorderCamera.ondataavailable = ondataavailable;
    }
  }

  public stopRecording() {
      this.mediaRecorderCamera.ondataavailable = null;
      if(this.mediaRecorderCamera.state != 'inactive') {
          this.mediaRecorderCamera.stop();
      }

      this.mediaStreamCamera.getTracks().forEach((t) => {
          t.stop();
      });
  }
}
