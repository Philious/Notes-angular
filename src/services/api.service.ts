import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { deleteCookie, getCookie, setCookie } from '../helpers/utils';
import { firstValueFrom, map, Observable, take, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:3000';
  private headers = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
  });

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${this.token()}`,
    });
  }

  private _token = signal<string | null>(null);
  token = this._token.asReadonly();

  initialize(): Promise<void> {
    const cookie = getCookie('NOTE_COOKIE') ?? null;
    return firstValueFrom(
      this.checkLoginStatus(cookie).pipe(
        tap((isValid) => {
          if (isValid) this._token.set(cookie);
        }),
        map(() => void 0),
      ),
    );
  }

  createUser(email: string, password: string) {
    this.http
      .post<{ token: string }>(
        `${this.baseUrl}/users`,
        { email, password },
        { headers: this.headers },
      )
      .pipe(take(1))
      .subscribe((response) => {
        if (response.token) {
          this._token.set(response.token);
        }
      });
  }

  login(email: string, password: string): void {
    this.http
      .post<{ token: string }>(
        `${this.baseUrl}/users/login`,
        { email, password },
        { headers: this.headers },
      )
      .pipe(take(1))
      .subscribe(({ token }) => {
        if (token) {
          setCookie('NOTE_COOKIE', token, 1);
          this.headers.append('Authorization', `Bearer ${this._token()}`);
          this._token.set(token);
          this.router.navigate(['./notes']);
        }
      });
  }

  checkLoginStatus(token: string | null): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.baseUrl}/users/check`,
      { token },
      { headers: this.getAuthHeaders() },
    );
  }

  updatePassword(email: string) {
    console.log(email);
  }

  logout() {
    this.http
      .delete<string>(`${this.baseUrl}/users/logout`, { headers: this.getAuthHeaders() })
      .pipe(take(1))
      .subscribe(() => {
        this._token.set(null);
        deleteCookie('NOTE_COOKIE');
        this.headers.delete('Authorization');
        this.router.navigate(['./login']);
      });
  }
}
