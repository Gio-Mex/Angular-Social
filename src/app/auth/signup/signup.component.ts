import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UsersService } from '../../modules/users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  name!: string;
  email!: string;
  token!: string;
  gender: 'male' | 'female' = 'male';
  errText!: string;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    (this.authService.setBearerToken(this.token),
    this.usersService.addUser({
      name: this.name,
      email: this.email,
      gender: this.gender,
      status: 'active',
    })).subscribe({
      next: () => {
        const message = 'User added successfully';
        this.openSnackBar(message);
        this.router.navigate(['/login']);
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
