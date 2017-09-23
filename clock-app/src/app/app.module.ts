import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClockComponent } from './clock/clock.component';
import { TimeService } from './clock/time.service';

@NgModule({
  declarations: [
    AppComponent,
    ClockComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [TimeService, {provide: "TIME_INTERVAL", useValue: 100}],
  bootstrap: [AppComponent]
})
export class AppModule { }
