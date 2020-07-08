import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaRecordingService} from '../../../services/media-recording/media-recording.service';
import * as posenet from '@tensorflow-models/posenet';
import {saveAs} from 'file-saver';
import {PoseVisualizerComponent} from "../pose-visualizer/pose-visualizer.component";
import {PosechatClientService} from "../../../services/posechat-client/posechat-client.service";

@Component({
    selector: 'pose-recorder',
    templateUrl: './pose-recorder.component.html',
    styleUrls: ['./pose-recorder.component.scss']
})
export class PoseRecorderComponent implements OnInit, OnDestroy, AfterViewInit{

    @ViewChild('video', {static: true}) public cameraElement: ElementRef<HTMLVideoElement>;
    @ViewChild('visualizer', {static: true}) visualizer: PoseVisualizerComponent;
    @ViewChild('incomingVisualizer', {static: true}) incomingVisualizer: PoseVisualizerComponent;
    @Input() public width: number = 320;
    @Input() public height: number = 240;
    private requestId;
    public webcamEnabled: boolean = false;
    public webcamRunning: boolean = false;
    public poseNetRunning: boolean = false;
    public poseRecording: boolean = false;
    private pn;
    private poses: any[] = [];
    public lastPoseStr = '';

    constructor(
        private mediaRecordingService: MediaRecordingService,
        private posechatClientService: PosechatClientService) {

    }

    ngOnInit() {
    }

    public ngAfterViewInit() {
    }

    ngOnDestroy() {
        this.stopPoseNet();
    }

    public startWebcam() {
        this.mediaRecordingService.requestCameraRecordingPermission(this.cameraElement).subscribe(res => {
            this.webcamEnabled = true;
            console.log('got webcam permission' + this.cameraElement);
        });
    }

    public stopWebcam() {
        this.webcamEnabled = false;
        this.webcamRunning = false;
        //this.cameraElement.nativeElement.pause();
        this.mediaRecordingService.stopRecording();
        this.stopPoseNet();
    }

    public onLoadedData() {
        this.webcamRunning = true;
    }

    public startPoseNet() {
        if (!this.webcamRunning) {
            return;
        }

        if (this.pn) {
            this.poseNetRunning = true;
            this.poseLoop();
            this.visualizer.startDraw();
        } else {
            posenet.load().then(pn => {
                console.log('posenet loaded');
                this.poseNetRunning = true;
                this.pn = pn;
                this.poseLoop();
                this.visualizer.startDraw();
            });
        }
    }

    public poseLoop() {
        if (this.poseNetRunning) {
            this.pn.estimateSinglePose(this.cameraElement.nativeElement).then(p => {
                p.timestamp = Date.now();

                // TODO: 3D transformation

                // store poses if recording
                if(this.poseRecording){
                    this.poses.push(p);
                }

                // create nose debug log
                this.lastPoseStr = `nose: (${p.keypoints[0].position.x.toFixed(2)}, ${p.keypoints[0].position.y.toFixed(2)})`;

                // hand over pose to visualizer
                this.visualizer.poseInput = p;

                // hand over pose to posechat
                this.posechatClientService.poseInput = p

                // new frame
                this.requestId = requestAnimationFrame(() => this.poseLoop());
            });
        }
    }

    public stopPoseNet() {
        this.poseNetRunning = false;
        cancelAnimationFrame(this.requestId);
        this.visualizer.stopDraw();
    }

    public startRecording(){
        // clear and restart
        this.poses = [];
        this.poseRecording = true;
    }

    public stopRecording(){
        this.poseRecording = false;
        this.storePoseFile();
    }

    public storePoseFile() {
        //const blob = new Blob([JSON.stringify(this.poses)], {type: 'application/json'});
        //saveAs(blob, 'poses.json');
        let posesCSV: string[] = [];

        // create header
        let header = 'timestamp';
        const pose = this.poses[this.poses.length-1];
        for (const k of pose.keypoints){
            header += `,${k.part}_score, ${k.part}_x, ${k.part}_y`;
        }
        posesCSV.push(header);

        // create pose data
        for (const p of this.poses) {
            let row = `${p.timestamp}`;
            for (const k of p.keypoints) {
                row += `,${k.score}, ${k.position.x}, ${k.position.y}`;
            }
            posesCSV.push(row);
        }

        // store
        const csv = posesCSV.join('\n');
        const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        saveAs(blob, 'poses.csv');
    }

    public togglePoseChat() {
        this.posechatClientService.toggleConnect();
    }

}
