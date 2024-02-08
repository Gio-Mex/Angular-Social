import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from '../../modules/users/users.service';
import { PostsService } from '../../modules/posts/posts.service';
import { DialogService } from '../../services/dialog.service';
import { AuthService } from '../../auth/auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  dialogTitle = this.dialogService.dialogTitle;
  field1Label = this.dialogService.field1Label;
  field1 = this.dialogService.field1;
  field2Label = this.dialogService.field2Label;
  field2 = this.dialogService.field2;
  field3Label = this.dialogService.field3Label;
  field3: 'male' | 'female' = 'male';
  pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  errText!: string;
  userId = this.dialogService.userId;
  postId = this.dialogService.postId;
  pageSize!: number;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private router: Router,
    private usersService: UsersService,
    private postService: PostsService,
    private dialogService: DialogService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  isButtonDisabled(): any {
    switch (this.dialogTitle) {
      case 'Add new User':
        return !this.field1 || !this.pattern.test(this.field2) || !this.field3;
      case 'Add new Post':
        return !this.field1 || !this.field2;
      case 'Add new Comment':
        return !this.field1;
    }
  }

  addUser(): void {
    this.pageSize = this.usersService.pageSize;
    this.usersService
      .addUser({
        name: this.field1,
        email: this.field2,
        gender: this.field3,
        status: 'active',
      })
      .subscribe({
        next: () => {
          this.dialogRef.close();
          const message = 'User added successfully';
          this.openSnackBar(message);
          setTimeout(() => window.location.reload(), 2000);
        },
        error: (error) => {
          this.handler(error);
        },
      });
  }

  addPost(): void {
    this.postService
      .addPost({
        user_id: localStorage.getItem('user.id:'),
        title: this.field1,
        body: this.field2,
      })
      .subscribe(() => {
        this.dialogRef.close();
        this.openSnackBar('Post added successfully');
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  addComment(post_id: string): void {
    this.postService
      .addComment(`${post_id}`, {
        name: localStorage.getItem('user.name:'),
        email: localStorage.getItem('user.email:'),
        body: this.field1,
      })
      .subscribe(() => {
        this.dialogRef.close();
        this.openSnackBar('Comment added successfully');
        setTimeout(() => window.location.reload(), 2000);
      });
  }

  deleteUser(id: any): void {
    this.usersService.deleteUser(id).subscribe(() => {
      this.dialogRef.close();
      this.openSnackBar('User deleted successfully');
      setTimeout(() => window.location.reload(), 2000);
    });
  }

  isLogout() {
    this.dialogRef.close();
    localStorage.clear();
    this.router.navigate(['/login']);
    this.openSnackBar('You are logged out');
    return this.authService.isAuthenticatedFn();
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
      duration: 1800,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  onSubmit() {
    switch (this.dialogTitle) {
      case 'Add new User':
        this.addUser();
        break;
      case 'Add new Post':
        this.addPost();
        break;
      case 'Add new Comment':
        this.addComment(this.postId);
        break;
      case 'Delete User':
        this.deleteUser(this.userId);
        break;
      case 'Logout':
        this.isLogout();
        break;
    }
  }
}
