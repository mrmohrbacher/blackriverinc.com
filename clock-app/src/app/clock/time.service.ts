import { Injectable, Inject, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/// Implement a simple time service to emit an event 
/// every second containing the current time.
@Injectable()
export class TimeService {

  private ticker = new BehaviorSubject<Date>(new Date());
  
  tick$ = this.ticker.asObservable();

  constructor(@Inject("TIME_INTERVAL") interval) { 
    console.log("Interval = " + interval);
    window.setInterval(() => {
      this.ticker.next(new Date());
    }, interval);
  }
}
