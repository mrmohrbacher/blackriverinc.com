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
  providers: [TimeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
