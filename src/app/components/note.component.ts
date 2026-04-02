import { Component, input, output, linkedSignal, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from './action/icon-button.component';
import { ButtonStyleEnum, IconEnum } from '../../helpers/enum';
import { NoteProps } from '../../helpers/types';
import { formatDate } from '../../helpers/utils';

@Component({
  selector: 'note',
  imports: [IconButtonComponent, ReactiveFormsModule, FormsModule],
  template: `
    <div class="title-container">
      <input class="title-input" input [(ngModel)]="title" />
    </div>
    <div class="date">
      <span>Created: {{ createdAt() }}</span>
      @if (updatedAt()) {
        <span>Updated: {{ updatedAt() }}</span>
      }
    </div>
    <div class="text-area-container">
      <textarea class="text-area" input [(ngModel)]="content"></textarea>
    </div>
    <div class="toolbar">
      <div class="toolbar-left-section">
        <icn-btn [icon]="IconEnum.Left" (update)="cancelNote.emit()" />
        <icn-btn [icon]="IconEnum.Check" (update)="saveNoteMapper()" />
      </div>
      <div class="toolbar-right-section">
        <icn-btn [icon]="IconEnum.Remove" (update)="removeNote.emit(note().id ?? null)" />
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
    }
    .toolbar-left-section,
    .toolbar-right-section {
      display: flex;
      gap: 0.5rem;
    }
    .title-container {
      margin: 1rem 1rem 0;
      @include media.mobile {
        margin: 0.5rem 0.5rem 0;
      }
    }
    .title-input {
      box-sizing: border-box;
      font-size: 1rem;
      height: 3rem;
      padding: 0 0.75rem;
      color: var(--n-700);
      box-sizing: border-box;
      border: 0.0625rem solid var(--n-200);
      border-radius: 4px;
      background-color: var(--n-100);
      transition: border-color 0.15s;
      &:hover {
        border: 0.0625rem solid var(--n-300);
      }
      width: 100%;
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
      @include media.mobile {
        margin: 0.5rem;
      }
    }
    .text-area {
      box-sizing: border-box;
      border-radius: 4px;
      border: 0.0625rem solid var(--n-200);
      background-color: var(--n-100);
      line-height: 1.5;
      font-size: 0.875rem;
      width: 100%;
      height: 100%;
      padding: 1rem 0.75rem;
      white-space-collapse: break-spaces;
      overflow-y: auto;
      resize: none;
      transition: border-color 0.15s;
      &:hover {
        border: 0.0625rem solid var(--n-300);
      }
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
