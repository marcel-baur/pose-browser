import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as posenet from "@tensorflow-models/posenet";
import {PoseVisualizerComponent} from "../pose-visualizer/pose-visualizer.component";

@Component({
    selector: 'pose-player',
    templateUrl: './pose-player.component.html',
    styleUrls: ['./pose-player.component.scss']
})
export class PosePlayerComponent implements OnInit {

    @ViewChild('fileInput', {static: true}) inputNode: ElementRef<HTMLInputElement>;
    @ViewChild('visualizer', {static: true}) visualizer: PoseVisualizerComponent;
    @Input() public width: number = 320;
    @Input() public height: number = 240;
    private ctx;
    public playing: boolean = false;
    private playTimeBuf = 0;
    private playRequestId;

    private csvHeaders: string[] = [];
    private csvRows: any[] = [];
    private csvFrame = 0;
    private csvFrameMax = -1;

    constructor() {
    }

    ngOnInit() {
    }

    public onFileSelected() {

        if (typeof (FileReader) !== 'undefined') {
            const reader = new FileReader();
            const file = this.inputNode.nativeElement.files[0]
            if(file.name.endsWith('.csv')){

                reader.onload = (data) => {
                    let csvData = reader.result;
                    let csvRecordsArray = csvData.toString().split(/\r\n|\n/);
                    let i =0;

                    for (let r of csvRecordsArray){
                        if (i==0){
                            this.csvHeaders = r.split(',');
                            console.log(this.csvHeaders);
                        } else{
                            const row = r.split(',');
                            this.csvRows.push(row);
                            console.log('left wrist:' + row[27] + ' x:'+row[28] + ' y:'+row[29])
                        }
                        i++;
                    }

                    // max
                    this.csvFrameMax = this.csvRows.length-1;
                };

                reader.readAsText(file);
            }
        }
    }

    private csvGetHeaderArray(csvRecordsArr: any)
    {
        let headers = csvRecordsArr[0].split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    public startPlayback(){
        if(this.csvFrameMax < 0) return;
        this.playing = true;
        this.playbackLoop();
        this.visualizer.startDraw();
    }

    public stopPlayback(){
        this.playing = false;
        this.visualizer.stopDraw();
    }

    private playbackLoop(){
        if (this.playing) {
            const now = Date.now();
            const t = now - this.playTimeBuf;

            // play at [x]ms/s
            if (t >= 33) {
                // convert row to json:
                // pose.keypoints[].score,.position.x,.y
                const row = this.csvRows[this.csvFrame];
                const pose = {'keypoints': []};
                pose.keypoints.push({'id': 'nose', 'score': row[1], 'position': {'x': row[2], 'y': row[3]}});
                pose.keypoints.push({'id': 'leftEye', 'score': row[4], 'position': {'x': row[5], 'y': row[6]}});
                pose.keypoints.push({'id': 'rightEye', 'score': row[7], 'position': {'x': row[8], 'y': row[9]}});
                pose.keypoints.push({'id': 'leftEar', 'score': row[10], 'position': {'x': row[11], 'y': row[12]}});
                pose.keypoints.push({'id': 'rightEar', 'score': row[13], 'position': {'x': row[14], 'y': row[15]}});
                pose.keypoints.push({'id': 'leftShoulder', 'score': row[16], 'position': {'x': row[17], 'y': row[18]}});
                pose.keypoints.push({'id': 'rightShoulder', 'score': row[19], 'position': {'x': row[20], 'y': row[21]}});
                pose.keypoints.push({'id': 'leftElbow', 'score': row[22], 'position': {'x': row[23], 'y': row[24]}});
                pose.keypoints.push({'id': 'rightElbow', 'score': row[25], 'position': {'x': row[26], 'y': row[27]}});
                pose.keypoints.push({'id': 'leftWrist', 'score': row[28], 'position': {'x': row[29], 'y': row[30]}});
                pose.keypoints.push({'id': 'rightWrist', 'score': row[31], 'position': {'x': row[32], 'y': row[33]}});
                this.visualizer.poseInput = pose;

                // update frame
                this.csvFrame++;
                if(this.csvFrame > this.csvFrameMax){
                    this.csvFrame = 0;
                }
                this.playTimeBuf = now;
            }

            // new frame
            this.playRequestId = requestAnimationFrame(() => this.playbackLoop());
        }
    }

}
