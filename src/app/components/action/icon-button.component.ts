import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icons/icon.component';
import { CommonModule } from '@angular/common';
import { IconEnum } from '../../../helpers/enum';

@Component({
  selector: 'icn-btn',
  imports: [IconComponent, CommonModule],
  host: {
    role: 'button',
  },
  template: `
    <icon class="icn" [icon]="icon()" />
  `,
  styles: `
    :host {
      background-color: transparent;
      border: none;
      padding: 0;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      position: relative;
      color: currentColor;
      display: grid;
      place-content: center;
      cursor: pointer;
      &:before {
        content: '';
        border-radius: 50%;
        position: absolute;
        inset: 0;
        background-color: transparent;
        transition: background-color 0.15s;
      }
      &:hover:before {
        background-color: var(--hover-clr);
      }
      &:active:before {
        background-color: var(--action-clr);
      }
      .icn {
        color: currentColor;
      }
    }
    :host-context(.fill) {
      background-color: var(--icn-bg-clr);
      color: var(--icn-clr-filled);
    }
    :host-context(.stroke) {
      border: 1px solid var(--border);
    }
    :host-context(.icn-btn) {
      color: inherit;
      cursor: pointer;
      display: grid;
      place-items: center;
    }
  `,
})
export class IconButtonComponent {
  readonly icon = input.required<IconEnum>();
  readonly color = input('var(--icon)');

  readonly update = output<MouseEvent>();
}
