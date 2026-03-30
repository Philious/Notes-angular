import { Component, OnInit, inject } from '@angular/core';
import { ButtonStyleEnum, IconEnum } from '../../helpers/enum';
import { NgOptimizedImage } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { IconButtonComponent } from './action/icon-button.component';

@Component({
  selector: 'day-info',
  imports: [IconButtonComponent, NgOptimizedImage],
  template: `
    <img
      class="img"
      fill
      onerror="this.onerrot=null; this.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC'"
      priority
      [alt]="timeOfDay.greeting"
      [ngSrc]="timeOfDay.imgUrl"
    />
    <div class="text">
      {{ timeOfDay.greeting }}
    </div>
    <div class="text date">
      {{ date }}
    </div>
    <icn-btn class="logout" [icon]="IconEnum.LogOut" (update)="onLogout()" />
  `,
  styles: `
    :host {
      box-sizing: border-box;
      grid-area: var(--day-area);
      height: var(--day-area-height);
      display: grid;
      padding: 0.5rem 1rem;
      place-content: end start;
      place-items: center start;
      background-size: cover;
      color: #fff;
      position: sticky;
      inset: 0 0 auto 0;
      gap: 0.5rem;
      line-height: 1;
      background-image: linear-gradient(180deg, #00000000 75%, #000 100%);
      box-shadow: 1px 0 var(--border);
      @media (prefers-color-scheme: light) {
        background-image: linear-gradient(180deg, #ffffff00 80%, #fff 100%);
      }
    }
    .img {
      position: absolute;
      inset: 0;
      width: 0%;
      height: 0%;
      mix-blend-mode: color;
      object-fit: cover;

      background: linear-gradient(rgb(170, 90, 125), rgb(253, 255, 217));
    }
    .text {
      position: relative;
      font-weight: 600;
      font-size: 1rem;
      filter: drop-shadow(0 0 1px hsla(0, 0%, 0%, 1)) drop-shadow(0 1px 2px hsla(0, 0%, 0%, 1));
    }
    .date {
      text-transform: uppercase;
      font-weight: 700;
      font-size: 0.625rem;
    }
    .logout {
      color: var(---white);
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
    }
  `,
})
export class DayInfoComponent implements OnInit {
  protected readonly IconEnum = IconEnum;
  protected readonly ButtonStyleEnum = ButtonStyleEnum;

  private apiService = inject(ApiService);

  timeOfDay!: { greeting: string; imgUrl: string };
  date!: string;
  timeout!: ReturnType<typeof setTimeout>;

  getState = () => {
    this.date = new Date().toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const hour = new Date().getHours();

    const timeRanges = [
      { range: [0, 5], greeting: 'Sleep', imgUrl: 'assets/images/night.png' },
      { range: [5, 9], greeting: 'Good Morning', imgUrl: 'assets/images/morning.png' },
      { range: [9, 12], greeting: 'Good Day', imgUrl: 'assets/images/midday.png' },
      { range: [12, 17], greeting: 'Good Afternoon', imgUrl: 'assets/images/afternoon.png' },
      { range: [17, 23], greeting: 'Good Evening', imgUrl: 'assets/images/evening.png' },
      { range: [23, 24], greeting: 'Good Night', imgUrl: 'assets/images/night.png' },
    ];

    this.timeOfDay = timeRanges.find(({ range }) => hour >= range[0] && hour < range[1]) || {
      greeting: 'Unknown Time',
      imgUrl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=',
    };
  };

  setState = (t: number): ReturnType<typeof setTimeout> => {
    const timeout = setTimeout(() => this.getState(), t);
    return timeout;
  };

  onLogout = () => {
    this.apiService.logout();
  };

  ngOnInit(): void {
    this.getState();
    this.timeout = this.setState(1000 * 60 * 60);
  }
}
