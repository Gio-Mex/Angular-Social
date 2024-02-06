import { Component, OnInit } from '@angular/core';

import { DialogComponent } from '../../../components/dialog/dialog.component';

import { UsersService } from '../users.service';
import { DialogService } from '../../../services/dialog.service';

import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  dataSource: any = [];
  displayedColumns: any[] = [
    'id',
    'name',
    'email',
    'gender',
    'status',
    'delete',
  ];
  pageSize = 10;
  pageNumber = 1;
  research!: string;
  openInput: boolean = false;
  totalCount!: number;
  isLoading!: boolean;
  noUsers!: boolean;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.usersService.title = 'Users';
    this.isLoading = true;
    this.research = '';
    this.totalCount = 0;
    this.usersService
    .getUsers(`?page=${this.pageNumber}&per_page=${this.pageSize}`)
    .subscribe((users) => {
        this.dataSource = Object.values(users.body);
        this.totalCount = users.count;
        this.isLoading = false;
      });
  }

  searchUser(research: string): Observable<any> {
    this.isLoading = true;
    this.noUsers = false;
   return of ( this.usersService
      .getUsers(`?name=${research}&page=${this.pageNumber}&per_page=${this.pageSize}`)
      .subscribe((users) => {
        if (users.body.length == 0) {
          this.usersService
            .getUsers(`?email=${research}&page=${this.pageNumber}&per_page=${this.pageSize}`)
            .subscribe((users) => {
              if (users.body.length == 0) {
                this.noUsers = true;
                this.isLoading = false;
              } else {
                this.dataSource = users.body;
                this.totalCount = users.count;
                this.isLoading = false;
                this.noUsers = false;
              }
            });
        } else {
          this.dataSource = users.body;
          this.totalCount = users.count;
          this.isLoading = false;
          this.noUsers = false;
        }
      }));
  }

  addUserDialog(): void {
    this.dialogService.dialogTitle = 'Add new User';
    this.dialogService.field1Label = 'Name';
    this.dialogService.field2Label = 'Email';
    this.dialogService.field3Label = 'Gender';
    this.dialog.open(DialogComponent, {
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      width: '100%',
    });
  }

  deleteUserDialog(user_id: string, user_name: string): void {
    this.dialogService.userId = user_id;
    this.dialogService.dialogTitle = 'Delete User';
    this.dialogService.field1Label = `Are you sure you want to delete ${user_name}?`;
    this.dialog.open(DialogComponent, {
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
      })
    }

onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.usersService.pageSize = this.pageSize;
    this.searchUser(this.research)
      .subscribe((users) => {
        this.dataSource = users.body;
      });
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 1300,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
