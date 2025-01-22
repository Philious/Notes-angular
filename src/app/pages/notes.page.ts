import { Component } from '@angular/core';
import { DayInfoComponent } from '../components/dayInfo.component';
import { NoteListComponent } from '../components/noteList.component';
import { NoteComponent } from '../components/note.component';
import { NoteService } from '../../services/notes.service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'notes',
  imports: [DayInfoComponent, NoteListComponent, NoteComponent],
  template: `

      <day-info />
      <note-list />
      <note class="note" [class.active]="activeNote"/>
  `,
  styles: `
    @use 'media-size.mixins' as media;
    @keyframes toggleVisible {
      0% { display: none; }
      1% { display: grid; }
      100% { display: grid; }
    }
    :host {
      display: flex;
      flex-direction: column;
      box-shadow: 0.0625rem 0 0 var(--n-300);
      height: 100vh;
      @include media.tabletUp {
        display: grid;
        grid-template-columns: var(--main-columns);
        grid-template-rows: var(--day-area-height) calc(100vh - var(--day-area-height));
      }
    }
    .note:not(.active) {
      display: none;
    }
  `
})
export class NotesPage {
  activeNote = false;
  constructor(noteService: NoteService) {
    noteService.activeNote$.subscribe(active => this.activeNote = !!active)
  }
}
