import { Component } from "@angular/core";
import { IconButtonComponent } from "./action/iconButton.component";
import { ButtonStyleEnum, IconEnum } from "../../helpers/enum";

@Component({
  selector: 'day-info',
  imports: [IconButtonComponent],
  template: `
    <img
      class="img"
      src="images/afternoon.png"
      alt=""
    />
    <div class="text">
      {{ greeting }}
    </div>
    <div class="text date">
      {{ date }}
    </div>
    <icon-button [icon]="IconEnum.LogOut" [buttonStyle]="ButtonStyleEnum.Transparent" (click)="onLogout()" class="logout"/>

  `,
  styles: `
    :host {
      --shadow: drop-shadow(0 0 1px hsla(0, 0%, 0%, .75)) drop-shadow(0 1px 2px hsla(0, 0%, 0%, .5));
      box-sizing: border-box;
      grid-area: var(--day-area);
      height: var(--day-area-height);
      display: grid;
      padding: .5rem 1rem;
      place-content: end start;
      place-items: center start;
      background-image: linear-gradient(180deg,hsla(0, 0%, 0%, 0) 75%, hsl(0, 0%, 0%)), url('/images/afternoon.png');
      background-size: cover;
      box-shadow: 0 6px 4px -4px #000, 0 12px 8px -8px #000, 0 18px 12px -12px #000, 1px 0 0 var(--n-300);
      color: #fff;
      position: sticky;
      inset: 0 0 auto 0;
      gap: .5rem;
      line-height: 1;
      z-index: 1;
    }
    .img {
      position: absolute;
      inset: 0;
      width: 0%;
      height: 0%;
      mix-blend-mode: hard-light;
      object-fit: cover;
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
      position: absolute;
      top: .5rem;
      right: .5rem;
    }
  `
})

export class DayInfoComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  onLogout = () => { }
  greeting = 'Hi'
  date = new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
}