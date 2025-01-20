import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginDetails } from '../types/types';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private baseUrl = 'https://example.com/api/notes';
  private headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json"
  });

  private token = new BehaviorSubject<string | null>(null);
  token$ = this.token.asObservable();

  constructor(private http: HttpClient) { }

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
        throw error; // Re-throw the error after logging it
      })
    );
  }

  /**
   * @param email string
   * @param password password
   * @returns User | null
   */
  login(email: string, password: string) {
    console.log('login');

    return this.http.get<string>(`${this.baseUrl}/users/login/${email}/${password}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    );
  }

  /**
   * @returns void
   */
  logout() {
    console.log('logout');
    if (!this.token) return console.log('User already logged out');

    return this.http.delete(`${this.baseUrl}/users/logout/${this.token}`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('Error fetching notes:', error);
        throw error; // Re-throw the error after logging it
      })
    );
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
        throw error; // Re-throw the error after logging it
      })
    );
  }
}