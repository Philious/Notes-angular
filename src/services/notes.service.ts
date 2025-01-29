import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Note, NoteProps } from '../helpers/types';
import { UserService } from './user.service';
import { sortNotes } from '../helpers/utils';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private baseUrl = 'http://localhost:3000';
  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });
  private router;
  private token: string | null = null;

  private observedNotes = new BehaviorSubject<Note[]>([]);
  public notes$: Observable<Note[]> = this.observedNotes.asObservable().pipe(
    map(notes => {
      return sortNotes(notes)
    })
  );

  private observedActiveNote = new BehaviorSubject<Note | null>(null);
  public activeNote$ = this.observedActiveNote.asObservable();

  constructor(private http: HttpClient, private userService: UserService, router: Router) {
    this.router = router;
    this.userService.token$.subscribe(token => {
      this.token = token;
      if (token) {
        this.getNotes();
        this.router.navigate(["notes"])
      }
      else {
        this.router.navigate(["login"])
        this.observedNotes.next([]);
      }
    })
  }

  setActiveNote(note: Note | null): void {
    this.observedActiveNote.next(note);
  }

  /**
   * Empty Note object.
   * @returns Note
   */
  newNote(): Note {
    const date = new Date().toDateString();
    return {
      id: '',
      title: '',
      content: '',
      catalog: '',
      tags: [],
      createdAt: date,
      updatedAt: date
    }
  }

  /**
   * Retrive all stored notes.
   * @returns void
   */
  getNotes(): void {
    this.http.get<Note[]>(`${this.baseUrl}/notes/${this.token}`, { headers: this.headers }).pipe(
      retry(5),
      map(body => (body ?? []) as Note[]),
      catchError((error: Error) => {
        console.error('Error fetching notes:', error.message);
        throw error;
      })
    ).subscribe(notes => {
      this.observedNotes.next(notes);
    });
  }

  /**
 * Retrive all stored notes.
 * @returns void
 */
  getNote(noteId: string): void {
    this.http.get<Note>(`${this.baseUrl}/notes/${this.token}/${noteId}`, { headers: this.headers }).pipe(
      retry(5),
      catchError((error: Error) => {
        throw error;
      })
    ).subscribe(note => {
      const notes = [...this.observedNotes.getValue()];
      const index = notes.findIndex(n => n.id === noteId);
      notes[index] = note;
      this.observedNotes.next(notes);
    });
  }

  /**
   * Add new note.
   * @param note Note
   * @returns void
   */
  addNote(note: NoteProps): void {
    this.http.post<Note>(`${this.baseUrl}/notes/${this.token}`, note, { headers: this.headers }).pipe(
      retry(5),
      catchError((error: Error) => {
        console.error('Error adding note:', error.message);
        throw error;
      })
    ).subscribe(note => {
      const notes = [...this.observedNotes.getValue()];
      notes.push(note);
      this.observedNotes.next(notes);
    });
  }

  /**
   * Update currently active note.
   * @param note Note
   * @returns void
   */
  updateNote(note: Partial<NoteProps> & { id: string }): void {
    this.http.put<void>(`${this.baseUrl}/notes/${this.token}`, note, { headers: this.headers }).pipe(
      retry(5),
      catchError((error: Error) => {
        console.error('Error updating note:', error.message);
        throw error; // Re-throw the error after logging it
      })
    ).subscribe(_ => {
      this.getNote(note.id)
    });
  }

  /**
   * Fetch a single note by ID.
   * @param note Note ID
   * @returns void
   */
  deleteNote(id: string): void {
    this.http.delete(`${this.baseUrl}/notes/${this.token}/${id}`, { headers: this.headers }).pipe(
      catchError((error: Error) => {
        console.error('Error deleting notes:', error.message);
        throw error; // Re-throw the error after logging it
      })
    ).subscribe(_ => {
      const notes = [...this.observedNotes.getValue()];
      const index = notes.findIndex(n => n.id === id);
      notes.splice(index, 1);
      this.observedNotes.next(notes);
    });
  }
}
