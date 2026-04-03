import { Component, input } from '@angular/core';
import { IconEnum, InputState } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

let inputId = 0;

@Component({
  selector: 'input-layout',
  imports: [IconComponent],
  host: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '[class]': '["type", { "pre-icon": preIcon(), "post-icon": postIcon() }, state()]',
  },
  template: `
    @if (label()) {
      <label class="label" [for]="inputId()">{{ label() }}</label>
    }
    @if (preIcon()) {
      <icon class="prefix-icon" [icon]="preIcon()" />
    }
    <ng-content />
    @if (postIcon()) {
      <icon class="sufix-icon" [icon]="postIcon()" />
    }
    @if (helpText()) {
      <div class="context-help">{{ helpText() }}</div>
    }
  `,
  styles: `
    :where(:host) {
      box-sizing: border-box;
      width: 100%;
      display: grid;
      grid-template-rows: auto 2.25rem auto;
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
        height: 2.25rem;
        width: 100%;
        margin-block: 0.25rem;
        box-sizing: border-box;
        width: 100%;
        position: relative;
        transition: border-color 0.15s;
      }

      .label,
      .context-help {
        color: var(--label);
        font-size: var(--txt-small);
        line-height: 1.2;
      }
      .label {
        margin-bottom: 0.25rem;
      }
      .context-help {
        margin-top: 0.25rem;
      }
      &.pre-icon {
        padding-left: 2.5rem;
      }
      &.post-icon {
        padding-right: 2.5rem;
      }
    }
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
    :host.error ::ng-deep {
      input {
        border: 1px solid var(--error);
      }
      .label,
      .context-help {
        color: var(--error);
      }
    }
  `,
})
export class InputLayoutComponent {
  protected readonly InputState = InputState;

  readonly inputId = input<string>(`input-id${++inputId}`);
  readonly type = input<string>('text');
  readonly state = input(InputState.Default);

  readonly preIcon = input<IconEnum>();
  readonly postIcon = input<IconEnum>();

  readonly helpText = input<string>();
  readonly label = input<string>();
}
