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
      <button class="icn-btn" (click)="onButtonClick()" [type]="type" base-input>
        <icon [icon]="icon" class="icn"/>
      </button>
    </div>
    
  `,
  styles: `
    .icn { fill: var(--clr) }
    .bg {
      width: 2rem;
      height: 2rem;
      margin: .125rem;
      border-radius: 50%;
      position: relative;
      &.filled {
        background-color: var(--n-500);
        .icn { fill: var(--black); }
      }
      &.border {
        fill: var(--n-500);
        border: 1px solid var(--n-300);
      }
    }
    .icn-btn {
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

  @Output() onClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.onClick.emit();
  }
}