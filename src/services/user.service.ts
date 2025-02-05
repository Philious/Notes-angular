import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, retry, takeUntil } from 'rxjs/operators';
import { deleteCookie, getCookie, setCookie } from '../helpers/utils';
import { Router } from '@angular/router';

type LoginDetails = {
  email: string;
  password: string;
}

type User = {
  uuid: string,
  createdAt: string,
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {

  private baseUrl = 'http://localhost:3000';
  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });
  private token = new BehaviorSubject<string | null>(null);
  token$ = this.token.asObservable();
  private destroy$ = new Subject<void>();
  public loading = false;

  constructor(private http: HttpClient, router: Router) {
    const cookie = getCookie('NOTE_COOKIE') ?? null;

    if (cookie) {
      const check$ = this.checkLoginStatus(cookie);
      check$
        .pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            console.error("Error checking login status:", error);
            router.navigate(["login"]);
            return []; // Return an empty array to prevent breaking the observable stream
          })
        )
        .subscribe(state => {
          if (state) {
            this.token.next(cookie)
          } else {
            router.navigate(["login"])
          }
        })
    }
  }

  ngOnDestroy() {
    this.destroy$.next(); // ✅ Cleanup all active subscriptions
    this.destroy$.complete();
  }

  /**
   * @param email string
   * @param password string
   * @returns User | null
   */
  createUser(email: string, password: string) {
    return this.http.post<User>(`${this.baseUrl}/users`, { email, password }, { headers: this.headers }).pipe(
      retry(5),
      catchError((error) => {
        console.error('Error creating user:', error.message);
        throw error;
      })
    );
  }

  /**
   * @param email string
   * @param password password
   * @returns User | null
   */
  login(email: string, password: string): void {
    this.http.get<string>(`${this.baseUrl}/users/login/${email}/${password}`, { headers: this.headers }).pipe(
      retry(5),
      catchError((error) => {
        console.error('Error fetching notes:', error.message);
        throw error;
      })
    ).subscribe(token => {
      setCookie('NOTE_COOKIE', token, 1);
      this.token.next(token);
    });
  }

  /**
   * @returns void
   */
  logout() {
    deleteCookie('NOTE_COOKIE');
    this.token.next(null)
    return this.http.delete(`${this.baseUrl}/users/logout/${this.token.value}`, { headers: this.headers }).pipe(
      retry(5),
      catchError((error: Error, caught) => {
        console.error('Error fetching notes:', error);
        return caught;
      })
    )
  }

  /**
   * @param token string
   * @returns boolean
   */
  checkLoginStatus(token: string | null) {
    return this.http.get<boolean>(`${this.baseUrl}/users/check/${token}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
        return of(false)
      })
    );
  }

  updatePassword(email: string) { alert(`Not implemented, no email sent to ${email}`) }

}