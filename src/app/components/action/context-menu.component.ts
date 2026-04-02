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
      [cdkConnectedOverlayPanelClass]="'pane'"
      [cdkConnectedOverlayPositions]="[
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
      ]"
      (itemSelected)="test($event)"
    >
      <ul class="menu context-menu" ngMenu (itemSelected)="selected($event)" #menu="ngMenu">
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
    .trigger {
      display: grid;
      place-items: center;
      background-color: transparent;
      border-radius: 1rem;
      color: var(--icn-clr);
      padding: 0;
      border: none;
      width: 2rem;
      height: 2rem;
      position: relative;
      cursor: pointer;
      transition: background-color 0.15s;
      &:hover {
        background-color: color-mix(in hsl, currentColor, transparent 72%);
      }
      &:before {
        content: '';
        border-radius: 50%;
        position: absolute;
        inset: -0.5rem;

        transition: background-color 0.15s;
      }
    }
    .context-menu {
      --translate-y: 1rem;
      top: 0;
      margin: 0;
      padding: 0;
      background-color: var(--overlay-bg-clr);

      border-radius: 0.25rem;
      list-style-type: none;
      opacity: 1;
      translate: 0 0;
      transition:
        opacity 0.25s,
        translate 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      &.leave {
        translate: 0 var(--translate-y);
        opacity: 0;
      }
      @include media.mobile {
        --translate-y: 0;
        translate: 0 -100%;
        width: 100%;
        .menuitem {
          justify-content: center;
        }
      }
      @starting-style {
        translate: 0 var(--translate-y);
        opacity: 0;
      }
    }

    ::ng-deep .pane {
      @include media.mobile {
        inset: auto 1rem 1rem !important;
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
      cursor: pointer;
      &:not(:last-child) {
        border-bottom: 0.0625rem solid var(--menu-border);
      }
      &:hover {
        background-color: color-mix(in hsl, var(--overlay-bg-clr), #fff 16%);
      }
      @include media.mobile {
        height: 3rem;
      }
    }
  `,
})
export class ContextMenuComponent {
  menu = viewChild<Menu<string>>('menu');
  options = input<Option[] | null>(null);
  menuSelection = output<string>();
  selected(label: string) {
    this.options()
      ?.find((o) => o.label === label)
      ?.action();
  }
  isMobile() {
    return (navigator as unknown as { userAgentData: { mobile: boolean } }).userAgentData.mobile;
  }
}
