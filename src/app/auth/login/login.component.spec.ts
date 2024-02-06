import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';

import { AppModule } from '../../app.module';

import { LoginComponent } from './login.component';

import { UsersService } from '../../modules/users/users.service';
import { AuthService } from '../auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockForm: NgForm;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'setBearerToken',
      'isAuthenticatedFn',
    ]);
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: NgForm, useValue: mockForm },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockAuthService = TestBed.inject(
          AuthService
        ) as jasmine.SpyObj<AuthService>;
        mockUsersService = TestBed.inject(
          UsersService
        ) as jasmine.SpyObj<UsersService>;
        mockSnackBar = TestBed.inject(
          MatSnackBar
        ) as jasmine.SpyObj<MatSnackBar>;
        mockForm = TestBed.inject(NgForm) as NgForm;
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.setBearerToken with the provided token and should handle the response from usersService.getUsers', () => {
    component.email = 'john@example.com';
    component.token = 'token123';
    const mockUsers = {
      body: [
        {
          id: 1,
          name: 'John',
          email: component.email,
          gender: 'male',
          status: 'active',
        },
      ],
    };
    const mockToken = component.token;
    mockUsersService.getUsers.and.returnValue(of(mockUsers));
    component.onSubmit(mockForm);
    mockRouter.navigate(['/user-list']);
    expect(mockAuthService.setBearerToken).toHaveBeenCalledWith(mockToken);
    expect(component.user).toEqual(mockUsers.body[0]);
    expect(localStorage.getItem('user.id:')).toEqual('1');
    expect(localStorage.getItem('user.name:')).toEqual('John');
    expect(localStorage.getItem('user.email:')).toEqual('john@example.com');
    expect(mockSnackBar.open).toHaveBeenCalledWith('Welcome John!', undefined, {
      duration: 2500,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
    expect(mockAuthService.isAuthenticatedFn).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user-list']);
  });

  it('should handle error with message', () => {
    const err = {
      error: {
        message: 'Test error message',
      },
    };
    spyOn(component, 'openSnackBar');

    component.handler(err);

    expect(component.errText).toBe('Test error message');
    expect(component.openSnackBar).toHaveBeenCalledWith('Test error message');
  });

  it('should handle error with array of errors', () => {
    const err = {
      error: [
        {
          field: 'TestField',
          message: 'Test error message',
        },
      ],
    };
    spyOn(component, 'openSnackBar');

    component.handler(err);

    expect(component.errText).toBe('TestField Test error message');
    expect(component.openSnackBar).toHaveBeenCalledWith(
      'Testfield test error message'
    );
  });
});
