import { ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import { of } from 'rxjs';

import { UserListComponent } from './user-list.component';

import { UsersModule } from '../users.module';

import { UsersService } from '../users.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  
  const mockUsers = {
    body: [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        gender: 'male',
        status: 'active',
      }
    ],
    count: 1
  };

  const mockPageEvent: PageEvent = {
    length: 0,
    pageIndex: 1,
    pageSize: 10,
    previousPageIndex: 0
  };

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers', 'searchUser']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [UsersModule],
      declarations: [UserListComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        mockUsersService = TestBed.inject(
          UsersService
        ) as jasmine.SpyObj<UsersService>;
        mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
        mockSnackBar = TestBed.inject(
          MatSnackBar
        ) as jasmine.SpyObj<MatSnackBar>;
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call usersService.getUsers', () => {
    mockUsersService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();
    expect(mockUsersService.getUsers).toHaveBeenCalled();
    expect(component.dataSource).toEqual(mockUsers.body);
    expect(component.totalCount).toEqual(mockUsers.count);
    expect(component.isLoading).toBeFalse();
  });

  it('should search users by name', fakeAsync(() => {

    mockUsersService.searchUser.and.returnValue(of(mockUsers));

    component.searchUser('john'); 

    tick(); 

    expect(component.dataSource).toEqual(mockUsers.body); 
    expect(component.totalCount).toEqual(mockUsers.count); 
    expect(component.noUsers).toBeFalse(); 
    expect(component.isLoading).toBeFalse();
  }));

  it('should search users by email', fakeAsync(() => {
    mockUsersService.searchUser.and.returnValue(of(mockUsers));

    component.searchUser('johndoe@example.com');

    tick();

    expect(component.dataSource).toEqual(mockUsers.body);
    expect(component.totalCount).toEqual(mockUsers.count);
    expect(component.noUsers).toBeFalse();
    expect(component.isLoading).toBeFalse();
  }));

  it('should open the addUser dialog', () => {
    component.addUserDialog();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should open the deleteUser dialog', () => {
    component.deleteUserDialog(String(mockUsers.body[0].id), mockUsers.body[0].name);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('sholud handle the page event', () => {
    mockUsersService.getUsers.and.returnValue(of(mockUsers));
    component.onPageChange(mockPageEvent);
    mockPageEvent.length += component.totalCount;
    expect(mockPageEvent.length).toBe(1);
    expect(component.pageSize).toEqual(mockPageEvent.pageSize);
    expect(component.pageNumber).toEqual(mockPageEvent.pageIndex + 1);
    
  });

  it('should open the snackbar', () => {
    component.openSnackBar('message');
    expect(mockSnackBar.open).toHaveBeenCalledWith('message', undefined, {
      duration: 1300,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });    
  });
});
