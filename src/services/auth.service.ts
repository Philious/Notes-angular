import { computed, Injectable, signal } from '@angular/core';
import { deleteCookie, getCookie, setCookie } from '../helpers/utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(null);
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  constructor() {
    this._token.set(getCookie('NOTE_COOKIE'));
  }

  setToken(token: string) {
    this._token.set(token);
    setCookie('NOTE_COOKIE', token, 1);
  }

  removeToken() {
    this._token.set(null);
    deleteCookie('NOTE_COOKIE');
  }
}
