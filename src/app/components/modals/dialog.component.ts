import { Component, EventEmitter, Input, Output } from '@angular/core';
import { actionButton } from '../../../helpers/types';
import { TextButton } from '../action/textButton.component';


@Component({
  selector: 'app-dialog',
  imports: [TextButton],
  template: `
    <button class="dialog-backdrop" (click)="onClose()"></button>
    <div class="dialog-box">
      @if (title) {
        <div class="title">
          {{ title }}
        </div>
      }
      @if (content) {
        <div class="content">
          {{ content }}
        </div>
      }
      <div class="action-btns">
        @for (button of actionButtons; track button.id) {
          <text-button [label]="button.label" (onClick)="button.action()"/>
        }
      </div>
    </div>
  `,
  styles: [
    `
      @use 'media-size.mixins' as media;
      .dialog-backdrop {
        opacity: 0;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
      }
      .dialog-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--overlay-bg-clr);
        color: var(--overlay-clr);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 18rem;
        display: grid;
        gap: 1.5rem;
        box-sizing: border-box;
        @include media.mobile {
          transform: translate(0, 0);
          inset: auto 1rem 1rem 1rem;
          width: auto;
        }
      }
      .close-btn {
        margin-top: 15px;
        padding: 5px 10px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .action-btns {
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
        @include media.mobile {
          flex-direction: column-reverse;
        }
      }
    `,
  ],
})

export class DialogComponent {
  @Input() title?: string;
  @Input() content?: string;
  @Input() actionButtons: actionButton[] = []
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
