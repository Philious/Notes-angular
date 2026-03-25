import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'text-button',
  template: `
    <button class="btn" (click)="onClickButton($event)">
      {{ label }}
    </button>
  `,
  styles: `
    @use 'media-size.mixins' as media;
    :host { display: contents; }
    .btn {
      height: 2rem;
      padding: 0 1rem;
      min-width: 5rem;
      color: var(--btn-clr);
      background-color: var(--btn-bg-clr);
      border-radius: 0.25rem;
      border: none;
      position: relative;
      box-sizing: border-box;
      &:after {
        content: "";
        position: absolute;
        inset: -.25rem 0;
      }
      @include media.mobile {
        height: 2.5rem;
      }
    }
  `
})
export class TextButton {
  @Input() label: string = '';
  @Output() onClick = new EventEmitter<Event>();

  onClickButton(event: Event) {
    this.onClick.emit(event)
  }
}