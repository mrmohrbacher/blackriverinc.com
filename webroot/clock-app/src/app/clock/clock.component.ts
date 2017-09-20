import { Component, OnInit } from '@angular/core';
import { TimeService } from './time.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  currentTime: Date;
  subscription: Subscription;

  constructor(private timeService: TimeService) {
  }

  ngOnInit() {
    this.subscription = this.timeService.tick$.subscribe(item => this.currentTime = item);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
