import { Component } from '@angular/core';
import { DayInfoComponent } from '../components/dayInfo.component';
import { NoteListComponent } from '../components/noteList.component';


@Component({
  selector: 'notes',
  imports: [DayInfoComponent, NoteListComponent],
  template: `

      <day-info />
      <note-list />

  `,
  styles: `
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
})
export class NotesPage {


}
