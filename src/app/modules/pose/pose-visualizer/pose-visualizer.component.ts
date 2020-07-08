import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'pose-visualizer',
    templateUrl: './pose-visualizer.component.html',
    styleUrls: ['./pose-visualizer.component.scss']
})
export class PoseVisualizerComponent implements OnInit, AfterViewInit {

    @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;
    @Input() public width: number = 320;
    @Input() public height: number = 240;
    @Input() public drawInterval: number = 33;      // redraw every [x]ms
    private ctx;
    private drawTimeBuf = 0;
    private drawRequestId;
    public drawing = false;
    public poseInput = null;



    constructor() {
    }

    ngOnInit() {
    }

    public ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext("2d");
        this.ctx.translate(this.width, 0);
        this.ctx.scale(-1, 1);
    }

    public startDraw(){
        this.drawing = true;
        this.drawLoop();
    }

    public stopDraw(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.draw(null);
        this.drawing = false;
    }

    private drawLoop() {
        if (this.drawing) {
            const now = Date.now();
            const t = now - this.drawTimeBuf;

            // draw at 30Hz
            if (t >= this.drawInterval) {
                this.draw(this.poseInput);
                //this.draw(this.poses[this.poses.length - 1]);
                this.drawTimeBuf = now;
            }

            // new frame
            this.drawRequestId = requestAnimationFrame(() => this.drawLoop());
        }
    }

    private draw(pose) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (pose) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.setLineDash([4, 4]);

            // draw each keypoint
            for (const k of pose.keypoints) {
                if (k.score > .5) {
                    this.ctx.beginPath();
                    this.ctx.arc(k.position.x, k.position.y, 3, 0, 2 * Math.PI);
                    this.ctx.fill();
                }
            }

            // draw head
            const nose = pose.keypoints[0];
            const leftEye = pose.keypoints[1];
            const rightEye = pose.keypoints[2];
            if(nose.score > .5 && leftEye.score > .5 && rightEye.score > .5){

                // head rotation
                const headRotY = Math.atan2(leftEye.position.y - rightEye.position.y, leftEye.position.x - rightEye.position.x);
                //const headRotX = Math.atan2(leftEye.position.y - rightEye.position.y, leftEye.position.x - rightEye.position.x);
                //const alphaDeg = alphaRad * 180 / Math.PI;

                this.ctx.beginPath();
                this.ctx.ellipse(nose.position.x, nose.position.y, 40, 50, headRotY, 0, 2 * Math.PI);
                this.ctx.stroke();

                /*
                this.ctx.beginPath();
                this.ctx.moveTo(0, 200);
                this.ctx.lineTo(200, 0);
                this.ctx.stroke();*/
            }

            // draw joints (link two points, 5,6=shoulders 7,8=elbows 9,10=wrists)
            const joints = [[5,6], [5,7], [6,8], [7,9], [8,10]];
            for (let j of joints){
                const a = pose.keypoints[j[0]];
                const b = pose.keypoints[j[1]];
                if(a.score > .5 && b.score > .5){
                    this.ctx.beginPath();
                    this.ctx.moveTo(a.position.x, a.position.y);
                    this.ctx.lineTo(b.position.x, b.position.y);
                    this.ctx.stroke();
                }
            }
        }
    }
}
