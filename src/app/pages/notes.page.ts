import { Component } from '@angular/core';
import { DayInfoComponent } from '../components/dayInfo.component';
import { NoteListComponent } from '../components/noteList.component';
import { NoteComponent } from '../components/modals/note.component';
import { NoteService } from '../../services/notes.service';
import { fadeUp } from '../../helpers/utils';

@Component({
  selector: 'notes',
  imports: [DayInfoComponent, NoteListComponent, NoteComponent,],
  template: `
    <day-info></day-info>
    <note-list></note-list>
    <note [@inOut]="activeNote ? 'open' : 'closed'" class="note" [class.active]="activeNote"></note>
  `,
  styles: [
    `
    @use 'media-size.mixins' as media;
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
    `
  ],
  animations: fadeUp
})
export class NotesPage {
  activeNote = false;

  constructor(private noteService: NoteService) {
    this.noteService.activeNote$.subscribe((active) => {
      this.activeNote = !!active;
    });
  }

}
