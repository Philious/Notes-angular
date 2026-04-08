import { AfterContentInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { IconEnum, InputState } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

let inputId = 0;

@Component({
  selector: 'input-layout',
  imports: [IconComponent],
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class]': '["type", { "pre-icon": preIcon(), "post-icon": postIcon() }]',
  },
  template: `
    @if (label()) {
      <label class="label" [for]="inputId()">{{ label() }}</label>
    }
    @if (preIcon()) {
      <icon class="prefix-icon" [icon]="preIcon()" />
    }
    <div class="input-wrapper" #inputWrapper><ng-content /></div>
    @if (postIcon()) {
      <icon class="sufix-icon" [icon]="postIcon()" />
    }
    @if (helpText()) {
      <div animate.leave="leave" class="context-help">{{ helpText() }}</div>
    }
  `,
  styles: `
    :where(:host) {
      box-sizing: border-box;
      width: 100%;
      display: grid;
      position: relative;
      grid-template-rows: auto minmax(2.25rem, min-content) auto;
      grid-template-columns: 2.25rem 1fr 2.25rem;

      &:not(.disabled) .input-wrapper:hover {
        border-color: var(--input-border);
      }
      .label {
        grid-area: 1 / 1 / 2 / 4;
      }
      .prefix-icon {
        grid-area: 2 / 1 / 3 / 2;
      }
      .sufix-icon {
        grid-area: 2 / 3 / 3 / 4;
      }
      .context-help {
        grid-area: 3 / 1 / 4 / 4;
      }

      :host-context(.input-wrapper) {
        background-color: var(--input-bg-clr);
        border: 0.0625rem solid var(-input-border);
        color: var(--input-clr);
        border-radius: 0.125rem;

        width: 100%;
        margin-block: 0.25rem;
        box-sizing: border-box;
        width: 100%;
        position: relative;
        transition: border-color 0.15s;
      }

      .label {
        margin-bottom: 0.25rem;
      }
      .input-wrapper {
        display: contents;
      }
      &.pre-icon {
        padding-left: 2.5rem;
      }
      &.post-icon {
        padding-right: 2.5rem;
      }
    }
    .label,
    .context-help {
      color: var(--label);
      font-size: var(--txt-small);
      line-height: 1.3333;
      transition: color 0.25s;
    }
    .context-help {
      max-height: 3rem;
      opacity: 1;
      translate: 0 0.25rem;

      transition:
        max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1),
        translate 0.25s 0.25s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.25s 0.25s,
        color 0.25s 0.25s;

      &.leave {
        opacity: 0;
        translate: 0 1rem;
        max-height: 0;
      }
      @starting-style {
        opacity: 0;
        translate: 0 1rem;
        max-height: 0;
      }
    }
    :host ::ng-deep .input,
    :host ::ng-deep input {
      grid-area: 2 / 1 / 3 / 4;
      border: 1px solid var(--input-border-clr);
      color: var(--input-clr);
      border-radius: 0.125rem;
      background-color: var(--input-bg-clr);
      transition-property: background-color, border-color;
      transition: 0.15s;
      &:hover {
        border-color: color-mix(in hsl, var(--input-border-clr) 92%, currentColor 8%);
      }
      &[disabled] {
        opacity: 0.6;
      }
      padding: 0 1rem;
    }
    :host:has(::ng-deep .ng-invalid.ng-touched) {
      input {
        border: 1px solid var(--error);
        outline-color: var(--error);
      }
      .label,
      .context-help {
        color: var(--error);
      }
    }
  `,
})
export class InputLayoutComponent implements AfterContentInit {
  protected readonly InputState = InputState;
  private inputWrapper = viewChild<ElementRef>('inputWrapper');
  readonly inputId = input<string>(`input-id${++inputId}`);
  readonly type = input<string>('text');

  readonly preIcon = input<IconEnum>();
  readonly postIcon = input<IconEnum>();

  readonly helpText = input<string>('');
  readonly label = input<string>();

  ngAfterContentInit(): void {
    const input: HTMLInputElement = this.inputWrapper()?.nativeElement.firstChild;
    input.setAttribute('id', this.inputId());
    input.setAttribute('setAriaDescribedBy', this.helpText());
  }
}
