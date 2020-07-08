import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule} from './modules/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoseModule} from './modules/pose/pose.module';

import { AppComponent } from './app.component';
import { PoseComponent } from './components/pose/pose.component';

@NgModule({
  declarations: [
    AppComponent,
    PoseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    PoseModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
