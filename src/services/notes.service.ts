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
   * @returns Observable<Note[]>
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
   * Fetch a single note by ID.
   * @param id Note ID
   * @param token Authorization token
   * @returns Observable<Note[]>
   */
  addNote(note: NoteProps) {
    console.log('Add note');

    return this.http.post<NoteProps>(`${this.baseUrl}/notes/${this.token}`, note, { headers: this.headers }).pipe(
      retry(5),
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    ).subscribe(response => console.log(response));
  }

  /**
   * Fetch a single note by ID.
   * @param note Note ID
   * @returns Observable<Note[]>
   */
  updateNote(note: Partial<NoteProps> & { id: string }) {
    console.log('Update note');

    return this.http.put<Partial<NoteProps>>(`${this.baseUrl}/notes/${this.token}`, note, { headers: this.headers }).pipe(
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
   * @returns Observable<Note[]>
   */
  deleteNote(id: string) {
    console.log('Delete note', id);

    return this.http.delete(`${this.baseUrl}/notes/${this.token}/${id}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    );
  }
}
