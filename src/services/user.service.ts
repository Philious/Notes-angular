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
        console.log('user blorg: ', state);
        if (state) {
          console.log(cookie);
          this.token.next(cookie)
        } else {
          // router.navigate(["login"])
        }
      })
    }
  }

  /**
   * @param email string
   * @param password password
   * @returns User | null
   */
  createUser(email: string, password: string) {
    console.log('create user');

    return this.http.post<LoginDetails>(`${this.baseUrl}/users`, { email, password }, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
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
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error;
      })
    ).subscribe(token => {
      console.log('login function: ', token);
      setCookie('NOTE_COOKIE', token, 1);
      this.token.next(token);
    });
  }

  /**
   * @returns void
   */
  logout() {
    console.log('logout');
    deleteCookie('NOTE_COOKIE');
    // if (!this.token) return console.log('User already logged out');

    console.log(`${this.baseUrl}/users/logout/${this.token.value}`, this.token.value);
    return this.http.delete(`${this.baseUrl}/users/logout/${this.token.value}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
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
    console.log('check');

    return this.http.get<boolean>(`${this.baseUrl}/users/check/${token}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error;
      })
    );
  }

  updatePassword(email: string) { alert(`Not really sending anything to ${email}`) }

}