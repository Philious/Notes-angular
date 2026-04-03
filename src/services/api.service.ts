import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { deleteCookie, getCookie, setCookie } from '../helpers/utils';
import { firstValueFrom, map, Observable, take, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private baseUrl = 'http://localhost:3000';

  private headers = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
  });

  initialize(): Promise<void> {
    const cookie = getCookie('NOTE_COOKIE') ?? null;
    return firstValueFrom(
      this.checkLoginStatus(cookie).pipe(
        tap((isValid) => {
          if (isValid && cookie) this.authService.setToken(cookie);
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
          this.authService.setToken(response.token);
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
          // this.headers .append('Authorization', `Bearer ${this.token()}`);
          this.authService.setToken(token);
          this.router.navigate(['./notes']);
        }
      });
  }

  checkLoginStatus(token: string | null): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.baseUrl}/users/check`,
      { token },
      { headers: this.headers },
    );
  }

  updatePassword(email: string) {
    console.log(email);
  }

  logout() {
    this.http
      .delete<string>(`${this.baseUrl}/users/logout`, { headers: this.headers })
      .pipe(take(1))
      .subscribe(() => {
        this.authService.removeToken();
        deleteCookie('NOTE_COOKIE');
        this.router.navigate(['./login']);
      });
  }
}
