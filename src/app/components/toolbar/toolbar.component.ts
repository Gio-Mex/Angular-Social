import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { DialogComponent } from '../dialog/dialog.component';

import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../auth/auth.service';
import { DialogService } from '../../services/dialog.service';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  title!: string;

  constructor(
    private location: Location,
    private menuService: MenuService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  ngAfterContentChecked() {
    if (this.location.path().includes('user/')) {
      this.title = 'User details';
    } else if (this.location.path().includes('user')) {
      this.title = 'Users';
    } else if (this.location.path().includes('post')) {
      this.title = 'Posts';
    } else {
      this.title = 'Angular Social';
    }
  }

  openSidenav() {
    this.menuService.openSidenav();
  }

  isLoggedIn() {
    return this.authService.isAuthenticatedFn();
  }

  logoutDialog(): void {
    this.dialogService.dialogTitle = 'Logout';
    this.dialogService.field1Label = `Are you sure you want to exit the application?`;
    this.dialog.open(DialogComponent, {
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });
  }
}
