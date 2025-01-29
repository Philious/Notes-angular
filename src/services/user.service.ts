import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginDetails } from '../helpers/types';
import { deleteCookie, getCookie, setCookie } from '../helpers/utils';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000';
  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });
  private token = new BehaviorSubject<string | null>(null);
  token$ = this.token.asObservable();

  public loading = false;

  constructor(private http: HttpClient, router: Router) {
    const cookie = getCookie('NOTE_COOKIE') ?? null;

    if (cookie) {
      const check$ = this.checkLoginStatus(cookie);
      check$.subscribe(state => {
        if (state) {
          this.token.next(cookie)
        } else {
          router.navigate(["login"])
        }
      })
    }
  }

  /**
   * @param email string
   * @param password string
   * @returns User | null
   */
  createUser(email: string, password: string) {
    return this.http.post<LoginDetails>(`${this.baseUrl}/users`, { email, password }, { headers: this.headers }).pipe(
      catchError((error: Error) => {
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
      catchError((error: Error) => {
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
    return this.http.delete(`${this.baseUrl}/users/logout/${this.token.value}`, { headers: this.headers }).pipe(
      catchError((error: Error) => {
        console.error('Error fetching notes:', error.message);
        throw error;
      })
    ).subscribe(_ => {
      this.token.next(null)
    });
  }

  /**
   * @param token string
   * @returns boolean
   */
  checkLoginStatus(token: string | null) {
    return this.http.get<boolean>(`${this.baseUrl}/users/check/${token}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error;
      })
    );
  }

  updatePassword(email: string) { alert(`Not really sending anything to ${email}`) }

}