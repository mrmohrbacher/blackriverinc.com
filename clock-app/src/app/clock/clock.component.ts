import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  height: number;
  width: number;

  analogVisible: boolean = true;

  @ViewChild("clockface") clockFace: ElementRef;

  private context: CanvasRenderingContext2D;
  private radius: number;

  constructor(private timeService: TimeService) {
    this.height = 100;
    this.width = 100;
  }

  ngOnInit() {
    this.subscription = this.timeService.tick$.subscribe(item => {
      this.currentTime = item;
      this.drawClock()
    });
  }

  ngAfterViewInit() {

    let container = this.clockFace.nativeElement.parentElement;
    this.height = this.clockFace.nativeElement.height = container.clientHeight;
    this.width = this.clockFace.nativeElement.width = container.clientWidth;
    this.radius = (this.height / 2) * 0.90; 
    this.context = this.clockFace.nativeElement.getContext("2d");
    this.context.translate(this.width / 2, this.height / 2);

    this.drawClock();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private drawFace(context: CanvasRenderingContext2D, radius: number) {
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);

    let bevelGrd = context.createRadialGradient(0, 0, radius * 0.75, 0, 0, radius);
    bevelGrd.addColorStop(0, "white");
    bevelGrd.addColorStop(1, "gray");
    context.fillStyle = bevelGrd;
    context.fill();

    // Draw central 'nub'
    context.beginPath();
    context.arc(0, 0, radius * 0.075, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
  }

  private drawNumbers(ctx: CanvasRenderingContext2D, radius: number, time: Date) {
    let ang: number;
    let currentHour: number = time.getHours();
    let currentMinute: number = time.getMinutes();
    let currentSecond: number = time.getSeconds();

    ctx.beginPath();
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let hour: number = 1; hour < 13; hour++) {
      ang = hour * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      if (currentSecond / 5 == hour) {
        ctx.rotate(-ang);
        ctx.fillText(((hour * 5) % 60).toString(), 0, 0);
      } else {
      ctx.fillText(hour.toString(), 0, 0);
      }
      if (currentSecond / 5 == hour) {
        ctx.rotate(ang);
      }
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
  }

  private drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  private drawTime(ctx, radius) {
    let hour = this.currentTime.getHours();
    let minute = this.currentTime.getMinutes();
    let second = this.currentTime.getSeconds();
    //hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
    this.drawHand(ctx, hour, radius * 0.45, radius * 0.07);
    //minute
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    this.drawHand(ctx, minute, radius * 0.75, radius * 0.07);
    // second
    second = (second * Math.PI / 30);
    this.drawHand(ctx, second, radius * 0.8, radius * 0.02);
  }

  private drawClock() {
    if (this.context != null) {

      this.drawFace(this.context, this.radius);
      this.drawNumbers(this.context, this.radius, this.currentTime);
      this.drawTime(this.context, this.radius);
    }
  }
}
