import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';

import { ToolbarComponent } from './toolbar.component';

import { AppModule } from '../../app.module';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../auth/auth.service';

import { MatDialog } from '@angular/material/dialog';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let location: Location;
  let mockMenuService: jasmine.SpyObj<MenuService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const MenuServiceSpy = jasmine.createSpyObj('MenuService', ['openSidenav']);
    const AuthServiceSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticatedFn',
    ]);
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ToolbarComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MenuService, useValue: MenuServiceSpy },
        { provide: AuthService, useValue: AuthServiceSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        location = TestBed.inject(Location);
        mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
        mockMenuService = TestBed.inject(
          MenuService
        ) as jasmine.SpyObj<MenuService>;
        mockAuthService = TestBed.inject(
          AuthService
        ) as jasmine.SpyObj<AuthService>;
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title based on the current location', () => {
    if (location.path().includes('user')) {
      component.ngAfterContentChecked();
      expect(component.title).toBe('Users');
    } else if (location.path().includes('post')) {
      component.ngAfterContentChecked();
      expect(component.title).toBe('Posts');
    } else {
      component.ngAfterContentChecked();
      expect(component.title).toBe('Angular Social');
    }
  });

  it('should open the sidenav when openSidenav is called', () => {
    mockMenuService.openSidenav();
    component.openSidenav();
    expect(mockMenuService.openSidenav).toHaveBeenCalled();
  });

  it('should check if the user is logged in', () => {
    mockAuthService.isAuthenticatedFn();
    mockAuthService.isAuthenticatedFn.and.returnValue(true);
    expect(component.isLoggedIn()).toBeTrue();
    mockAuthService.isAuthenticatedFn.and.returnValue(false);
    expect(component.isLoggedIn()).toBeFalse();
  });

  it('should open the logout dialog', () => {
    component.logoutDialog();
    expect(mockDialog.open).toHaveBeenCalled();
  });
});
