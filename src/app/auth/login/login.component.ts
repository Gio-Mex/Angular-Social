import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { UsersService } from '../../modules/users/users.service';

import { User } from '../../models/user';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email!: string;
  token!: string;
  user!: User;
  errText!: string;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    this.authService.setBearerToken(this.token);
    this.usersService.getUsers(`email=${this.email}`).subscribe({
      next: (users) => {
        if (users.body.length === 0) {
          const message = 'Email not found';
          this.openSnackBar(message);
          return;
        }
        this.user = users.body[0];
        localStorage.setItem('user.id:', String(this.user.id));
        localStorage.setItem('user.name:', this.user.name);
        localStorage.setItem('user.email:', this.user.email);
        const message = 'Welcome ' + this.user.name + '!';
        this.openSnackBar(message);
        this.router.navigate(['user-list']);
        return this.authService.isAuthenticatedFn();
      },
      error: (error) => {
        this.handler(error);
      },
    });
  }

  handler(err: any): void {
    if (err.error && Array.isArray(err.error) && err.error.length > 0) {
      const errorField = err.error[0].field;
      const errorMessage = err.error[0].message;
      this.errText = errorField + ' ' + errorMessage;
    } else {
      this.errText = err.error.message;
    }
    const capitalizedText =
      this.errText.charAt(0).toUpperCase() +
      this.errText.slice(1).toLowerCase();
    this.openSnackBar(capitalizedText);
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 2500,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
