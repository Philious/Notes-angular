import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../helpers/types';
import { take } from 'rxjs';

type NoteProps = {
  id?: string;
  title: string;
  content: string;
  catalog: string;
  tags: string[];
};

@Injectable()
export class NoteService {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:3000/notes';

  private _notes = signal<Note[]>([]);
  notes = this._notes.asReadonly();
  activeNote = signal<Note | null>(null);

  constructor() {
    this.getAllNotes();
  }

  setActiveNote(note: Note | null): void {
    this.activeNote.set(note);
  }

  newNote(note?: Partial<Note>): Note {
    const date = new Date();

    return {
      id: '',
      title: '',
      content: '',
      createdAt: date,
      updatedAt: date,
      ...note,
    };
  }

  getAllNotes(): void {
    this.http
      .get<Note[]>(`${this.baseUrl}/all`)
      .pipe(take(1))
      .subscribe((notes) => {
        const mappedNotes = notes.map((n) => ({
          ...n,
          updatedAt: new Date(n.updatedAt),
          createdAt: new Date(n.createdAt),
        }));
        this._notes.set(mappedNotes);
      });
  }

  getNote(noteId: string): Promise<Note> {
    return new Promise<Note>((resolve) => {
      this.http.get<Note>(`${this.baseUrl}/${noteId}`).subscribe((note) => {
        resolve(note);
      });
    });
  }

  addNote(note: Partial<Note>): void {
    this.http.post<Note>(`${this.baseUrl}`, { note }).subscribe((note) => {
      this._notes.update((n) => [...n, note]);
    });
  }

  updateNote(partialNote: Partial<NoteProps> & { id: string }): void {
    this.http.put<Note>(`${this.baseUrl}`, { note: partialNote }).subscribe((note) => {
      this._notes.update((notes) => notes.map((n) => (n.id === note.id ? note : n)));
    });
  }

  deleteNote(id: string): void {
    this.http.delete(`${this.baseUrl}/${id}`).subscribe(() => {
      this._notes.update((n) => n.filter((note) => note.id !== id));
    });
  }
}
