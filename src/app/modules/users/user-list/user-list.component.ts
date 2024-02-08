import { Component, OnInit } from '@angular/core';

import { DialogComponent } from '../../../components/dialog/dialog.component';

import { UsersService } from '../users.service';
import { DialogService } from '../../../services/dialog.service';

import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

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
  searchSubject: 'name' | 'email' = 'name';
  searchUrl!: string;
  openInput: boolean = false;
  totalCount!: number;
  isLoading!: boolean;
  noUsers!: boolean;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.noUsers = false;
    this.openInput = false;
    this.research = '';
    this.searchSubject = 'name';
    this.usersService
      .getUsers(`page=${this.pageNumber}&per_page=${this.pageSize}`)
      .subscribe((users) => {
        this.dataSource = users.body;
        this.totalCount = users.count;
        this.isLoading = false;
      });
  }

  searchUser(research: string): void {
    this.research = research;
    this.isLoading = true;
    this.usersService.pageSize = this.pageSize;
    this.searchSubject == 'name'
      ? (this.searchUrl = `name=${this.research}`)
      : (this.searchUrl = `email=${this.research}`);
    this.usersService.searchUrl = this.searchUrl;
    this.usersService.searchUser().subscribe((users) => {
      if (users.body.length === 0) {
        this.noUsers = true;
        this.isLoading = false;
      } else {
        this.noUsers = false;
        this.isLoading = false;
        this.dataSource = users.body;
        this.totalCount = users.count;
      }
    });
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
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.usersService.pageSize = this.pageSize;
    this.usersService
      .getUsers(
        `${`${this.searchUrl}`}&page=${this.pageNumber}&per_page=${this.pageSize}`
      )
      .subscribe((users) => {
        this.dataSource = Object.values(users.body);
        this.totalCount = users.count;
      });
  }
}
