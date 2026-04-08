import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icons/icon.component';
import { CommonModule } from '@angular/common';
import { IconEnum } from '../../../helpers/enum';

@Component({
  selector: 'icn-btn',
  imports: [IconComponent, CommonModule],
  template: `
    <button class="btn" hover [aria-label]="ariaLabel()" (click)="update.emit()">
      <icon class="icn" [icon]="icon()" />
    </button>
  `,
  styles: `
    :host {
      width: 2rem;
      height: 2rem;
    }
    .btn {
      background-color: transparent;
      border: none;
      padding: 0;
      width: inherit;
      height: inherit;
      border-radius: 50%;
      position: relative;
      display: grid;
      place-content: center;
      cursor: pointer;
      transition-property: border-color, background-color;
      transition: 0.15s;
      color: currentColor;
      &:before {
        content: '';
        border-radius: 50%;
        position: absolute;
        inset: -0.5rem;
        background-color: transparent;
        transition: background-color 0.15s;
      }
      .icn {
        color: currentColor;
      }
      &:after {
        border-radius: 50%;
      }
    }
    :host-context(.fill) .btn {
      background-color: var(--icn-bg-clr);
      color: var(--icn-clr-filled);
      &:hover {
        background-color: color-mix(in hsl, var(--icn-bg-clr), currentColor 16%);
      }
    }
    :host-context(.stroke) .btn {
      border: 1px solid var(--border);
    }
    :host-context(.btn) {
      color: inherit;
      cursor: pointer;
      display: grid;
      place-items: center;
    }
  `,
})
export class IconButtonComponent {
  readonly icon = input.required<IconEnum>();
  readonly ariaLabel = input.required();
  readonly color = input('var(--icon)');

  readonly update = output<void>();
}
