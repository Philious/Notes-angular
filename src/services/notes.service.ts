import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Note, NoteProps } from '../types/types';
import { UserService } from './user.service';

const sortNotes = (notes: Note[]): Note[] => {
  return notes.sort((a, b) => {
    const date = new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
    if (date !== 0) return date;
    return a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1
  });
}

@Injectable({
  providedIn: 'root',
})

export class NoteService {
  private baseUrl = 'http://localhost:3000';
  private token: string | null = null;
  private observedNotes = new BehaviorSubject<Note[]>([]);
  public notes$ = this.observedNotes.asObservable().pipe(
    map(notes => sortNotes(notes))
  );
  private activeNote = new BehaviorSubject<Note | null>(null);
  public activeNote$ = this.activeNote.asObservable();
  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });

  constructor(private http: HttpClient, private userService: UserService) {
    this.userService.token$.subscribe({
      next: (value) => {
        console.log('ServiceB received value from ServiceA:', value);
        this.token = value
      },
      error: (err) => console.error('Error receiving value:', err),
    });
  }

  /**
   * @param token Authorization token
   * @returns void
   */
  setToken(token?: string): void { this.token = token ?? null; }

  /**
   * @returns Observable<Note[]>
   */
  getNotes(): void {
    this.http.get<Note[]>(`${this.baseUrl}/notes/${this.token}`, { headers: this.headers }).pipe(
      retry(5),
      map(body => { console.log(body); return (body ?? []) as Note[] }),
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    ).subscribe(notes => {
      this.observedNotes.next(notes); // Update the BehaviorSubject
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
function retry(arg0: number): import("rxjs").OperatorFunction<Note[], unknown> {
  throw new Error('Function not implemented.');
}

