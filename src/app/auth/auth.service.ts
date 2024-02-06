import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  bearerToken!: string;

  constructor() {}

  setBearerToken(token: string) {
    this.bearerToken = token;
    localStorage.setItem('bearerToken:', token);
  }

  isAuthenticatedFn() {
    if (
      localStorage.getItem('bearerToken:') &&
      localStorage.getItem('user.email:')
    ) {
      this.bearerToken = localStorage.getItem('bearerToken:')!;
      return true;
    } else {
      return false;
    }
  }
}
