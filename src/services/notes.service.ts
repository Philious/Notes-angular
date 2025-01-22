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
      this.token = token ?? null;
      if (token) {
        this.getNotes();
        this.router.navigate(["notes"])
      }
      else { this.observedNotes.next([]); }
    })
  }

  /**
   * @returns Observable<Note[]>
   */
  getNotes(): void {
    this.http.get<Note[]>(`${this.baseUrl}/notes/${this.token}`, { headers: this.headers }).pipe(
      retry(5),
      map(body => (body ?? []) as Note[]),
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error;
      })
    ).subscribe(notes => {
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
    );
  }

  /**
   * Fetch a single note by ID.
   * @param note Note ID
   * @returns Observable<Note[]>
   */
  updateNote(note: Partial<NoteProps> & { id: string }) {
    console.log('Update note');

    return this.http.post<Partial<NoteProps>>(`${this.baseUrl}/notes/${this.token}`, note, { headers: this.headers }).pipe(
      retry(5),
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    );
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
