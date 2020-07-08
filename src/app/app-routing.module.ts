import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PosePlayerComponent} from "./modules/pose/pose-player/pose-player.component";
import {PoseRecorderComponent} from "./modules/pose/pose-recorder/pose-recorder.component";


const routes: Routes = [
  {path: '', component: PoseRecorderComponent},
  {path: 'player', component: PosePlayerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
