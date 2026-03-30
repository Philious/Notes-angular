import { Component, input, output, viewChild } from '@angular/core';
import { IconComponent } from '../icons/icon.component';
import { Option } from '../../../helpers/types';
import { Menu, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'context-menu',
  imports: [IconComponent, Menu, MenuItem, MenuTrigger, OverlayModule],
  template: `
    <button class="trigger" ngMenuTrigger [menu]="menu()" #origin #trigger="ngMenuTrigger">
      <ng-content />
    </button>
    <ng-template
      cdkAttachPopoverAsChild
      [cdkConnectedOverlay]="{ origin, usePopover: 'inline' }"
      [cdkConnectedOverlayOpen]="trigger.expanded()"
      [cdkConnectedOverlayPositions]="[
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
      ]"
    >
      <ul
        animate.enter="enter"
        animate.leave="leave"
        class="menu context-menu"
        ngMenu
        (itemSelected)="menuSelection.emit($event)"
        #menu="ngMenu"
      >
        @for (option of options(); track option.id) {
          <li class="option" ngMenuItem [value]="option.label">
            @if (option.icon) {
              <icon [icon]="option.icon" />
            }
            {{ option.label }}
          </li>
        }
      </ul>
    </ng-template>
  `,
  styles: `
    @use 'media-size.mixins' as media;
    :host {
      display: contents;
    }
    .mask {
      position: fixed;
    }
    .trigger {
      background-color: transparent;
      color: var(--icn-clr);
      border: none;
      width: 2.5rem;
      height: 2.5rem;
      cursor: pointer;
    }
    .context-menu {
      top: 0;
      margin: 0;
      padding: 0;
      background-color: var(--overlay-bg-clr);
      position: absolute;
      border-radius: 0.25rem;
      list-style-type: none;

      transition:
        opacity 0.25s,
        transform 0.25s;
      &.enter {
        opacity: 1;
        transform: translateY(0);
      }
      &.leave {
        opacity: 0;
        transform: translateY(1rem);
      }
      @starting-style {
        opacity: 0;
        transform: translateY(1rem);
      }
      @include media.mobile {
        inset: auto 1rem 1rem 1rem !important;
        padding: 0;
      }
    }
    .option {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      padding: 0 1rem;
      position: relative;
      color: var(--overlay-clr);
      height: var(--menu-list-item-height);
      min-width: 12.5rem;
      &:not(:last-child) {
        border-bottom: 0.0625rem solid var(--menu-border);
      }
      @include media.mobile {
        height: 3rem;
      }
    }
  `,
})
export class ContextMenuComponent {
  menu = viewChild<Menu<string>>('formatMenu');
  options = input<Option[] | null>(null);
  menuSelection = output<Pick<Option, 'id'>>();
}
