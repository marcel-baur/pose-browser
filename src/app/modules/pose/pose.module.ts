import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoseRecorderComponent } from './pose-recorder/pose-recorder.component';
import { MediaRecordingService} from "../../services/media-recording/media-recording.service";
import { MaterialModule} from "../material/material.module";
import { PosePlayerComponent } from './pose-player/pose-player.component';
import { PoseVisualizerComponent } from './pose-visualizer/pose-visualizer.component';
import { PosechatClientService} from "../../services/posechat-client/posechat-client.service";


@NgModule({
  declarations: [
    PoseRecorderComponent,
    PosePlayerComponent,
    PoseVisualizerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    PoseRecorderComponent,
    PosePlayerComponent
  ],
  providers: [
    MediaRecordingService,
    MaterialModule,
      PosechatClientService
  ],
})
export class PoseModule { }
