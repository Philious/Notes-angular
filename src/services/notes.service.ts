import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Note } from '../helpers/types';
import { ApiService } from './api.service';
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
  private apiService = inject(ApiService);

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${this.apiService.token()}`,
    });
  }

  private baseUrl = 'http://localhost:3000/notes';

  private _notes = signal<Note[]>([]);
  notes = this._notes.asReadonly();
  activeNote = signal<Note | null>(null);

  constructor() {
    const subscriber = effect(() => {
      if (this.apiService.token()) {
        this.getAllNotes();
        subscriber.destroy();
      }
    });
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
      .get<Note[]>(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() })
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
      this.http
        .get<Note>(`${this.baseUrl}/${noteId}`, { headers: this.getAuthHeaders() })
        .subscribe((note) => {
          resolve(note);
        });
    });
  }

  addNote(note: Partial<Note>): void {
    this.http
      .post<Note>(`${this.baseUrl}`, note, { headers: this.getAuthHeaders() })
      .subscribe((note) => {
        this._notes.update((n) => {
          n.push(note);
          return n;
        });
      });
  }

  updateNote(partialNote: Partial<NoteProps> & { id: string }): void {
    this.http
      .put<Note>(`${this.baseUrl}`, partialNote, { headers: this.getAuthHeaders() })
      .subscribe((note) => {
        this._notes.update((notes) => {
          return notes.map((n) => (n.id === note.id ? note : n));
        });
      });
  }

  deleteNote(id: string): void {
    this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() }).subscribe(() => {
      this._notes.update((n) => {
        return n.filter((note) => note.id !== id);
      });
    });
  }
}
