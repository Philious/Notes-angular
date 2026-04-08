import { Component, inject, input, output, Renderer2 } from '@angular/core';
import { ButtonStyleEnum, IconEnum } from '../../helpers/enum';
import { Note } from '../../helpers/types';
import { ContextMenuComponent } from './action/context-menu.component';
import { IconButtonComponent } from './action/icon-button.component';
import { IconComponent } from './icons/icon.component';
import { ListItem } from './noteListItem.component';

@Component({
  selector: 'note-list',
  imports: [ListItem, ContextMenuComponent, IconButtonComponent, IconComponent],
  template: `
    <div class="list-header">
      <div class="header">Notes</div>
      <div class="list-options">
        <context-menu [ariaLabel]="'Change font size'" [options]="letterSizeMenu">
          <icon [icon]="IconEnum.LetterSize" />
        </context-menu>
        <icn-btn [ariaLabel]="'New Note'" [icon]="IconEnum.Add" (update)="newNote.emit()" />
      </div>
    </div>
    <ul class="list">
      @for (note of notes(); track note.id) {
        <li class="list-item-container">
          <list-item [note]="note" (click)="selectNote.emit(note.id)" />
        </li>
      }
    </ul>
  `,
  styles: `
    @use 'media-size.mixins' as media;
    :host {
      position: relative;
      grid-area: var(--list-area);
      max-width: var(--note-list-width);
      max-height: 100%;
      overflow-y: hidden;
      box-shadow: 1px 0 0 var(--border);
      flex: 1;
      display: flex;
      @include media.tabletUp {
        grid-template-rows: var(--toolbar-height) 1fr;
      }
    }
    .list-header {
      background-color: var(--bg-clr);
      box-sizing: border-box;
      position: absolute;
      top: 0;
      align-items: center;
      display: flex;
      place-self: center start;
      gap: 0.5rem;
      padding: 0 0.5rem 0 1rem;
      justify-content: space-between;
      width: 100%;
      height: var(--list-header-height);
      box-sizing: border-box;
      border-bottom: 0.0625rem solid var(--border);
    }
    .header {
      text-transform: uppercase;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .list-options {
      display: flex;
      gap: 0.5rem;
      color: var(--icn-clr);
    }
    .list {
      background-color: var(--bg-clr);
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      list-style: none;
      padding: 0 0 3rem 0;
      margin: 3rem 0 0 0;
      scroll-snap-type: y mandatory;
    }
    .list-item-container {
      scroll-snap-align: start;
      &:not(:last-child) {
        box-shadow: 0 1px 0 var(--border);
      }
    }
  `,
})
export class NoteListComponent {
  protected readonly IconEnum = IconEnum;
  protected readonly ButtonStyleEnum = ButtonStyleEnum;

  private renderer = inject(Renderer2);

  notes = input<Note[]>([]);

  selectNote = output<string>();
  newNote = output<void>();

  updateAppFontSize(size: number) {
    console.log(document.documentElement);
    this.renderer.setProperty(document.documentElement, 'style', `--app-font-size: ${size}px`);
  }

  protected letterSizeMenu = [
    { id: 'id1', label: 'Large', action: () => this.updateAppFontSize(22) },
    { id: 'id2', label: 'Normal', action: () => this.updateAppFontSize(16) },
    { id: 'id3', label: 'Small', action: () => this.updateAppFontSize(12) },
  ];
}
