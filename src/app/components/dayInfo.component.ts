import { Component, OnInit } from "@angular/core";
import { IconButtonComponent } from "./action/iconButton.component";
import { ButtonStyleEnum, IconEnum } from "../../helpers/enum";
import { UserService } from "../../services/user.service";
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'day-info',
  imports: [IconButtonComponent, NgOptimizedImage],
  template: `
    <img
      class="img"
      [ngSrc]="timeOfDay.imgUrl"
      [alt]="timeOfDay.greeting"
      fill
      priority
      onerror="this.onerrot=null; this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC'"
    />
    <div class="text">
      {{ timeOfDay.greeting }}
    </div>
    <div class="text date">
      {{ date }}
    </div>
    <icon-button [icon]="IconEnum.LogOut" [buttonStyle]="ButtonStyleEnum.Transparent" (click)="onLogout()" class="logout" [color]="'white'"/>

  `,
  styles: `
    :host {
      --shadow: drop-shadow(0 0 1px hsla(0, 0%, 0%, 1)) drop-shadow(0 1px 2px hsla(0, 0%, 0%, 1));
      box-sizing: border-box;
      grid-area: var(--day-area);
      height: var(--day-area-height);
      display: grid;
      padding: .5rem 1rem;
      place-content: end start;
      place-items: center start;
      background-image: linear-gradient(180deg,hsla(0, 0%, 0%, 0) 75%, hsl(0, 0%, 0%));
      background-size: cover;
      box-shadow: 0 6px 4px -4px #000, 0 12px 8px -8px #000, 0 18px 12px -12px #000, 1px 0 0 var(--n-300);
      color: #fff;
      position: sticky;
      inset: 0 0 auto 0;
      gap: .5rem;
      line-height: 1;
    }
    .img {
      position: absolute;
      inset: 0;
      width: 0%;
      height: 0%;
      mix-blend-mode: hard-light;
      object-fit: cover;
      background: linear-gradient(rgb(170, 90, 125), rgb(253, 255, 217));
    }
    .text {
      position: relative;
      font-weight: 600;
      font-size: 1rem;
      filter: var(--shadow);
    }
    .date {
      text-transform: uppercase;
      font-weight: 700;
      font-size: .625rem;
    }
    .logout {
      color: var(---white);
      position: absolute;
      top: .5rem;
      right: .5rem;
    }
  `
})

export class DayInfoComponent implements OnInit {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  userService: UserService;
  timeOfDay!: { greeting: string, imgUrl: string }
  date!: string;
  timeout!: ReturnType<typeof setTimeout>;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getState = () => {
    this.date = new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
    const hour = new Date().getHours();

    const timeRanges = [
      { range: [0, 5], greeting: 'Sleep', imgUrl: 'assets/images/night.png' },
      { range: [5, 9], greeting: 'Good Morning', imgUrl: 'images/morning.png' },
      { range: [9, 12], greeting: 'Good Day', imgUrl: 'assets/images/midday.png' },
      { range: [12, 17], greeting: 'Good Afternoon', imgUrl: 'images/afternoon.png' },
      { range: [17, 23], greeting: 'Good Evening', imgUrl: 'images/evening.png' },
      { range: [23, 24], greeting: 'Good Night', imgUrl: 'images/night.png' },
    ];

    this.timeOfDay = timeRanges.find(({ range }) => hour >= range[0] && hour < range[1]) ||
      { greeting: 'Unknown Time', imgUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=' }
      ;
  }

  setState = (t: number): ReturnType<typeof setTimeout> => {
    const timeout = setTimeout(() => this.getState(), t);
    return timeout;
  }

  onLogout = () => { this.userService.logout() }

  ngOnInit(): void {
    this.getState();
    this.timeout = this.setState(1000 * 60 * 60)
  }
}