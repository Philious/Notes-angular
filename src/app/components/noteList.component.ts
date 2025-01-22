import { Component } from "@angular/core";
import { IconButtonComponent } from "./action/iconButton.component";
import { ButtonStyleEnum, IconEnum } from "../../helpers/enum";
import { ListItem } from "./noteListItem";
import { NoteService } from "../../services/notes.service";
import { Note } from "../../helpers/types";
import { map } from "rxjs/operators";

@Component({
  selector: 'note-list',
  imports: [IconButtonComponent, ListItem],
  template: `
    <div class="list-header">
      <label class="header">Notes</label>
      <div class="list-options">
        <icon-button
          [icon]="IconEnum.LetterSize"
          [buttonStyle]="ButtonStyleEnum.Transparent"
        />
        <icon-button
          [icon]="IconEnum.Add"
          [buttonStyle]="ButtonStyleEnum.Transparent"
        />
      </div>
    </div>
    @if (notes.length) { 
      <ul class="list">
        @for (note of notes; track note.id) {
          @if (note.updatedAt) { 
          <li class="list-item-container">
            <list-item [note]="note" (onClick)="openNote($event)" />
          </li>
          }
        }
      </ul>
    }
  `,
  styles: `
    @use 'media-size.mixins' as media;
    :host {
      grid-area: var(--list-area);
      max-width: var(--note-list-width);
      max-height: 100%;
      overflow-y: auto;
      box-shadow: 1px 0 0 var(--n-300);
      flex: 1;
      display: contents;
      @include media.tabletUp {
        display: grid;
        grid-template-rows: var(--toolbar-height) 1fr;
      }
    }
    .list-header {
      background-color: var(--black);
      box-sizing: border-box;
      position: sticky;
      top: var(--list-header-top);
      align-items: center;
      display: flex;
      place-self: center start;
      gap: .5rem;
      padding: 0 .5rem 0 1rem;
      justify-content: space-between;
      width: 100%;
      height: 3rem;
      box-sizing: border-box;
      border-bottom: 1px solid var(--n-400);
      z-index: 1;
    }
    .header {
      text-transform: uppercase;
      font-size: .75rem;
      font-weight: 700;
    }
    .list-options {
      display: flex;
    }
    .to-notes-btn {
      gap: .125rem;
    }
    .list {
      background-color: var(--black);
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-x: hidden;
      overflow-y:auto;
      list-style: none;
      padding: 0 0 3rem 0;
      margin: 0;
      scroll-snap-type: y mandatory;
    }
    .list-item-container {
      scroll-snap-align: start;
      &:not(:last-child) {
        box-shadow: 0 1px 0 var(--n-300);
      }
      &:active {
        &,
        .list-item-content:after {
          background-color: var(--n-100);
        }
      }
    }
  `
})

export class NoteListComponent {
  IconEnum = IconEnum;
  ButtonStyleEnum = ButtonStyleEnum;
  notes: Note[] = [];

  constructor(noteService: NoteService) {
    noteService.notes$.subscribe(notes => {
      this.notes = notes
    })
  }
  openNote = (id: string) => { console.log(id) }
}