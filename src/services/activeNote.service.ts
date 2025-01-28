import { Injectable, ApplicationRef, ComponentRef, createComponent, Signal, EnvironmentInjector, Injector, ViewContainerRef } from '@angular/core';
import { Note } from '../helpers/types';
import { NoteComponent } from '../app/components/modals/note.component';
import { NoteService } from './notes.service';
import { DialogService } from './dialogService';
import { newNote } from '../helpers/utils';

@Injectable({ providedIn: 'root' })
export class ActiveNoteService {
  private activeNoteRef: ComponentRef<NoteComponent> | null = null;
  private note: Note = newNote();

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector,
    private noteService: NoteService,
    private dialogService: DialogService
  ) { }

  open(note?: Note): void {
    if (note) { this.note = note; }

    const componentRef = createComponent(NoteComponent, {
      environmentInjector: this.environmentInjector,
    });

    componentRef.instance.createdDate = new Date(note?.createdAt ?? new Date()).toLocaleDateString('sv-se', { year: "2-digit", month: "2-digit", day: "2-digit" });
    componentRef.instance.updatedDate = note?.updatedAt ? new Date(note?.updatedAt).toLocaleDateString('sv-se', { year: "2-digit", month: "2-digit", day: "2-digit" }) : '';
    componentRef.instance.title = this.note.title;
    componentRef.instance.content = this.note.content;
    componentRef.instance.close.subscribe(() => this.close());

    this.appRef.attachView(componentRef.hostView);
    document.getElementById('app')!.appendChild(componentRef.location.nativeElement);

    this.activeNoteRef = componentRef;
  }

  save(title: string, content: string): void {
    if (this.note.id) {
      this.noteService.updateNote({ ...this.note, title: title })
    } else { this.noteService.addNote({ ...this.note, content, title }) }
    this.noteService.setActiveNote(null);
    this.dialogService.close()
    this.close();
  }

  cancel(title: string, content: string): void {
    console.log(this.note.title, this.note.content, title, content)
    if (this.note.title === title && this.note.content === content) {
      this.dialogService.close()
      this.close();
    } else {
      this.dialogService.open([
        { id: 'id1', label: 'Cancel', action: this.dialogService.close },
        { id: 'id2', label: 'Save Changes', action: () => this.save(title, content) },
        {
          id: 'id3', label: 'Discard Changes', action: () => {
            console.log('discard');
            this.dialogService.close();
            this.close();
          }
        }
      ], 'The note has been changed')
    }
  }

  delete(): void {
    if (this.note.id) {
      this.dialogService.open([
        { id: 'id1', label: 'Cancel', action: () => this.dialogService.close() },
        { id: 'id2', label: 'Remove', action: () => this.noteService.deleteNote(this.note.id) }
      ], 'Delete note?')
    } else {
      this.dialogService.close();
      this.close();
    }
  }

  close(): void {
    if (this.activeNoteRef) {
      this.appRef.detachView(this.activeNoteRef.hostView);
      this.activeNoteRef.destroy();
      this.activeNoteRef = null;
    }
  }
}
