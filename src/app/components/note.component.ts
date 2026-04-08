import { Component, input, output, linkedSignal, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from './action/icon-button.component';
import { ButtonStyleEnum, IconEnum } from '../../helpers/enum';
import { NoteProps } from '../../helpers/types';
import { formatDate } from '../../helpers/utils';
import { InputLayoutComponent } from './action/input-layout.component';

@Component({
  selector: 'note',
  imports: [IconButtonComponent, ReactiveFormsModule, FormsModule, InputLayoutComponent],
  template: `
    <input-layout class="title-container" [inputId]="'note-title'">
      <input class="title-input" type="text" [(ngModel)]="title" />
    </input-layout>
    <div class="date">
      <span>Created: {{ createdAt() }}</span>
      @if (updatedAt()) {
        <span>Updated: {{ updatedAt() }}</span>
      }
    </div>
    <input-layout class="text-area-container">
      <textarea class="text-area input" [(ngModel)]="content"></textarea>
    </input-layout>
    <div class="toolbar">
      <div class="toolbar-left-section">
        <icn-btn [ariaLabel]="'Cancel'" [icon]="IconEnum.Left" (update)="cancelNote.emit()" />
        <icn-btn [ariaLabel]="'Save'" [icon]="IconEnum.Check" (update)="saveNoteMapper()" />
      </div>
      <div class="toolbar-right-section">
        <icn-btn
          [ariaLabel]="'Delete'"
          [icon]="IconEnum.Remove"
          (update)="removeNote.emit(note().id ?? null)"
        />
      </div>
    </div>
  `,
  styles: `
    @use 'media-size.mixins' as media;
    :host {
      grid-area: var(--note-area);
      background-color: var(--bg-clr);
      color: var(--clr);
      position: fixed;
      inset: 0 0 0 var(--note-width);
      display: grid;
      grid-template-rows: auto 1.5rem 1fr;
    }
    .toolbar {
      box-sizing: border-box;
      display: flex;
      height: 3rem;
      align-items: center;
      padding: 0 0.5rem;
      justify-content: space-between;
      border-top: 0.0625rem solid var(--border);
      color: var(--icn-clr);
    }
    .toolbar-left-section,
    .toolbar-right-section {
      display: flex;
      gap: 0.5rem;
    }
    .title-container {
      display: flex;
      margin: 1rem 1rem 0;
      width: initial;
      height: 3rem;
      grid-template-rows: 3rem;
      @include media.mobile {
        margin: 0.5rem 0.5rem 0;
      }
    }
    .title-input {
      flex: 1;
      font-size: 1rem;
    }
    .date {
      font-size: 0.625rem;
      height: 1.5rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--n-500);
      padding: 0 1rem;
      justify-content: space-between;
      align-items: center;
      display: flex;
      margin: auto 0;
      position: relative;
    }
    .text-area-container {
      margin: 1rem;
      width: initial;
      @include media.mobile {
        margin: 0.5rem;
      }
    }
    .text-area.input {
      line-height: 1.5;
      font-size: 0.875rem;
      padding: 1rem 0.75rem;
      white-space-collapse: break-spaces;
      overflow-y: auto;
      resize: none;
      grid-area: 1 / 1 / 4 / 4;
    }
  `,
})
export class NoteComponent {
  protected readonly IconEnum = IconEnum;
  protected readonly ButtonStyleEnum = ButtonStyleEnum;

  readonly note = input.required<Partial<NoteProps>>();

  protected title = linkedSignal<string>(() => this.note().title || '');
  protected content = linkedSignal<string>(() => this.note().content || '');
  protected createdAt = computed<string>(() => formatDate(this.note().createdAt ?? new Date()));
  protected updatedAt = computed<string>(() => {
    const updated = this.note().updatedAt;
    return updated ? formatDate(updated) : '';
  });

  readonly cancelNote = output<void>();
  readonly saveNote = output<NoteProps>();
  readonly removeNote = output<string | null>();

  protected saveNoteMapper() {
    this.saveNote.emit({
      ...this.note(),
      title: this.title(),
      content: this.content(),
      updatedAt: new Date(),
    });
  }
}
