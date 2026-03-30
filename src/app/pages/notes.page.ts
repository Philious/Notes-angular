import { Component, inject, signal } from '@angular/core';
import { NoteProps } from '../../helpers/types';
import { NoteService } from '../../services/notes.service';
import { DayInfoComponent } from '../components/dayInfo.component';
import { NoteComponent } from '../components/note.component';
import { NoteListComponent } from '../components/noteList.component';

@Component({
  selector: 'notes',

  imports: [DayInfoComponent, NoteListComponent, NoteComponent],
  template: `
    @let note = this.note();
    <day-info></day-info>
    <note-list [notes]="notes()" (newNote)="newNote()" (selectNote)="selectNote($event)" />
    @if (note) {
      <note [note]="note" (cancelNote)="cancelNote()" (saveNote)="saveNote($event)" />
    }
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
    `,
  ],
})
export class NotesPageComponent {
  private noteService = inject(NoteService);

  protected notes = this.noteService.notes;
  protected note = signal<NoteProps | null>(null);

  protected selectNote(noteId: string) {
    const note = this.notes().find((n) => n.id === noteId) ?? null;
    this.note.set(note);
    console.log('select note', this.note());
  }

  protected saveNote(props: NoteProps) {
    if (props?.id) {
      const note = props as NoteProps & { id: string };
      this.noteService.updateNote(note);
    } else {
      this.noteService.addNote(props);
    }
  }

  protected newNote() {
    this.note.set({
      title: '',
      content: '',
      createdAt: new Date(),
    });
  }

  protected cancelNote() {
    this.note.set(null);
  }
}
