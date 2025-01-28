import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { IconComponent } from "../icons/icon.component";
import { Option, Position } from '../../../helpers/types'
import { getPosition } from "../../../helpers/utils";

@Component({
  selector: 'context-menu',
  imports: [IconComponent],
  template: `
    @if (options) {
      <button
        class="mask"
        (click)="onClose()"
        base-input
      ></button>
      <ul class="context-menu" #menu [style]="{top: position.y, left: position.x }" [class.visible]="visible">
        @for (option of options; track option.id) {
          <li class="option">
            <button class="option-btn"
              (click)="onSelect(option)"
              base-input
            >
              @if (option.icon) {
                <icon [icon]="option.icon"/>
              } 
              {{ option.label }}
            </button>
          </li>
        }
      </ul>
    }
  `,
  styles: `
    :host { display: contents; }
    .mask {
      position: fixed;
    }
    .context-menu {
      top: 0;
      margin: 0;
      background-color: var(--overlay-bg-clr);
      position: absolute;
      padding-block: var(--menu-vertical-padding);
      border-radius: 0.25rem;
      padding: .5rem 0;
      list-style-type: none;
      opacity: 0;
      transform: translateY(1rem);
      transition: opacity .25s, transform .25s;
      &.visible {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .option {
      position: relative;
      color: var(--overlay-clr);
      height: var(--menu-list-item-height);
      min-width: 12.5rem;
    }
    .option-btn {
      text-align: left;
      padding-inline: var(--menu-horisontal-padding);
    }
  `
})

export class ContextMenuComponent implements AfterViewInit {
  @ViewChild('menu', { static: false }) menu: ElementRef | null = null;

  @Input() options: Option[] | null = null;
  @Input() parentPostition: Position | null = null;

  @Output() close = new EventEmitter<void>();

  position = { x: '0', y: '0' }
  visible = false;

  onClose(): void {
    console.log('close');
    this.visible = false;
    setTimeout(() => this.close.emit(), 250)
  }

  onSelect(option: Option): void {
    option.action();
    if (!option.keepOpenOnClick) this.onClose()
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      if (this.parentPostition && this.menu) {
        const childPosition = this.menu.nativeElement.getBoundingClientRect()
        this.position = getPosition(this.parentPostition, childPosition)
        this.visible = true;
      }
    })
  }
}