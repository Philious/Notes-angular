import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { IconComponent } from "../icons/icon.component";
import { CommonModule } from "@angular/common";
import { ButtonStyleEnum, IconEnum } from "../../../helpers/enum";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'icon-button',
  imports: [IconComponent, CommonModule],
  template: `
    <div [ngClass]="['bg', buttonStyle]">
      <button class="icn-btn" (click)="onButtonClick($event)" [type]="type" base-input>
        <icon [icon]="icon" class="icn" [ngStyle]="{color: color}"/>
      </button>
    </div>
    
  `,
  styles: `
    .bg {
      width: 2rem;
      height: 2rem;
      margin: .125rem;
      border-radius: 50%;
      position: relative;
      color: var(--icn-clr)
    }
    .filled {
      background-color: var(--n-500);
      color: var(--icn-clr-filled); 
    }
    .border {
      border: 1px solid var(--n-300);
    }
    .icn-btn {
      color: inherit;
      cursor: pointer;
      inset: -.5rem;
      display: grid;
      place-items: center;
    }
  `
})

export class IconButtonComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;

  @Input() type = 'button';
  @Input() icon!: IconEnum;
  @Input() buttonStyle = ButtonStyleEnum.Transparent;
  @Input() color: string = 'var(--icon)';

  @Output() onClick = new EventEmitter<MouseEvent>();

  onButtonClick(event: MouseEvent): void {
    this.onClick.emit(event);
  }
}