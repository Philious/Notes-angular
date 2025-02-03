import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IconEnum, InputState } from '../../../helpers/enum';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'input-layout',
  imports: [IconComponent],
  template: `
  <div class="input-container" [class]="['type', {'pre-icon': preIcon, 'post-icon': postIcon}, state]">
    <label class="label" [for]="inputId" >{{ label }}</label>
    <div class="input-wrapper">
      @if (preIcon) {
        <icon [icon]="preIcon"/>
      }
      <ng-content />
      @if (postIcon) {
        <icon [icon]="postIcon"/>
      }
    </div>
    @if (helpText) {
      <div class="help-text">{{(helpText)}}</div>
    }
  </div>
  `,
  styles: `
    :where(input-layout) {
      width:100%;
    }
    .input-container {
      display: grid;
      &:not(.disabled) .input-wrapper:hover {
        border-color: var(--input-border);
      }
      &.error {
        .help-text { color: var(--error); }
        .input-wrapper {
          border-color: var(--error);
        }
      }
      .input-wrapper {
        background-color: var(--input-bg-clr);
        border: 0.0625rem solid var(-input-border);
        color: var(--input-clr);
        border-radius: 0.125rem;
        height: 2.25rem;
        width: 100%;
        margin-block: .25rem; 
        box-sizing: border-box;
        width: 100%;
        position: relative;
        transition: border-color .15s;
      }
      .label,
      .help-text {
        &:empty { display: none; }
        color: var(--label);
        font-size: var(--txt-small);
        line-height: 1.2;
      }
      input {
        position: absolute;
        inset: 0;
        padding: 0 1rem;
      }
      &.pre-icon { padding-left: 2.5rem; }
      &.post-icon { padding-right: 2.5rem; }
    }
  `,
  encapsulation: ViewEncapsulation.None
})

export class InputLayoutComponent {
  InputState = InputState;
  @Input() inputId!: string;
  @Input() type: string = 'text';
  @Input() state = InputState.Default;
  @Input() helpText: string = '';
  @Input() label?: string;
  @Input() preIcon?: IconEnum;
  @Input() postIcon?: IconEnum;

}