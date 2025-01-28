import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
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
    map(notes => sortNotes(notes))
  );

  private observedActiveNote = new BehaviorSubject<Note | null>(null);
  public activeNote$ = this.observedActiveNote.asObservable();

  constructor(private http: HttpClient, private userService: UserService, router: Router) {
    this.router = router;
    this.userService.token$.subscribe(token => {
      console.log('token update', token);
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
    console.log('get notes');
    this.http.get<Note[]>(`${this.baseUrl}/notes/${this.token}`, { headers: this.headers }).pipe(
      retry(5),
      map(body => (body ?? []) as Note[]),
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error;
      })
    ).subscribe(notes => {
      console.log('notes', notes);
      this.observedNotes.next(notes);
    });

  }

  /**
   * Add new note.
   * @param note Note
   * @returns void
   */
  addNote(note: NoteProps): void {
    console.log('Add note');

    this.http.post<NoteProps>(`${this.baseUrl}/notes/${this.token}`, note, { headers: this.headers }).pipe(
      retry(5),
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    ).subscribe(response => console.log(response));
  }

  /**
   * Update currently active note.
   * @param note Note
   * @returns void
   */
  updateNote(note: Partial<NoteProps> & { id: string }): void {
    console.log('Update note');

    this.http.put<Partial<NoteProps>>(`${this.baseUrl}/notes/${this.token}`, note, { headers: this.headers }).pipe(
      retry(5),
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    ).subscribe(notes => this.observedNotes.next(notes as Note[]));
  }

  /**
   * Fetch a single note by ID.
   * @param note Note ID
   * @returns void
   */
  deleteNote(id: string): void {
    console.log('Delete note', id);

    this.http.delete(`${this.baseUrl}/notes/${this.token}/${id}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    );
  }
}
