import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AppModule } from '../../app.module';

import { SignupComponent } from './signup.component';

import { UsersService } from '../../modules/users/users.service';
import { AuthService } from '../auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockForm: NgForm;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['addUser']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'setBearerToken',
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SignupComponent],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: NgForm, useValue: mockForm },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockUsersService = TestBed.inject(
          UsersService
        ) as jasmine.SpyObj<UsersService>;
        mockAuthService = TestBed.inject(
          AuthService
        ) as jasmine.SpyObj<AuthService>;
        mockSnackBar = TestBed.inject(
          MatSnackBar
        ) as jasmine.SpyObj<MatSnackBar>;
        mockForm = TestBed.inject(NgForm) as NgForm;
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser and navigate on successful submission', () => {
    component.name = 'John Doe';
    component.email = 'john@example.com';
    component.token = 'token123';
    component.gender = 'male';
    const mockUserData = {
      id: 1,
      name: component.name,
      email: component.email,
      gender: component.gender,
      status: 'active',
    };
    const mockToken = component.token;
    mockUsersService.addUser.and.returnValue(of(mockUserData));
    component.onSubmit(mockForm);
    expect(mockAuthService.setBearerToken).toHaveBeenCalledWith(mockToken);
    expect(mockUsersService.addUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    });
    mockRouter.navigate(['/login']);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'User added successfully',
      undefined,
      {
        duration: 2500,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      }
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
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
          message: 'test error message',
        },
      ],
    };
    spyOn(component, 'openSnackBar');

    component.handler(err);

    expect(component.errText).toBe('TestField test error message');
    expect(component.openSnackBar).toHaveBeenCalledWith(
      'Testfield test error message'
    );
  });
});
