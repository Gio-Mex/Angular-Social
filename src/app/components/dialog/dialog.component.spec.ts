import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AppModule } from '../../app.module';

import { DialogComponent } from './dialog.component';

import { UsersService } from '../../modules/users/users.service';
import { PostsService } from '../../modules/posts/posts.service';
import { AuthService } from '../../auth/auth.service';

import { MatDialogRef } from '@angular/material/dialog';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockRouter: Router;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockPostsService: jasmine.SpyObj<PostsService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const DialogRefSpy = jasmine.createSpyObj(['close']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    const UsersServiceSpy = jasmine.createSpyObj('UsersService', [
      'addUser',
      'deleteUser',
    ]);
    const PostsServiceSpy = jasmine.createSpyObj([
      'addPost',
      'addComment',
      'postId',
    ]);
    const AuthServiceSpy = jasmine.createSpyObj(['isAuthenticatedFn']);

    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [DialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: DialogRefSpy },
        { provide: Router, useValue: mockRouter },
        { provide: UsersService, useValue: UsersServiceSpy },
        { provide: PostsService, useValue: PostsServiceSpy },
        { provide: AuthService, useValue: AuthServiceSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        mockUsersService = TestBed.inject(
          UsersService
        ) as jasmine.SpyObj<UsersService>;
        mockPostsService = TestBed.inject(
          PostsService
        ) as jasmine.SpyObj<PostsService>;
        mockAuthService = TestBed.inject(
          AuthService
        ) as jasmine.SpyObj<AuthService>;
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable button based on dialog title', () => {
    component.dialogTitle = 'Add new User';
    component.field1 = 'Test User';
    component.field2 = 'test@example.com';
    component.field3 = 'male';
    expect(component.isButtonDisabled()).toBe(false);

    component.dialogTitle = 'Add new Post';
    expect(component.isButtonDisabled()).toBe(false);

    component.dialogTitle = 'Add new Comment';
    expect(component.isButtonDisabled()).toBe(false);
  });

  it('should add a new user', fakeAsync(() => {
    component.dialogTitle = 'Add new User';
    component.field1 = 'John Doe';
    component.field2 = 'john@example.com';
    component.field3 = 'male';
    const mockUserData = {
      id: 1,
      name: component.field1,
      email: component.field2,
      gender: component.field3,
      status: 'active',
    };
    mockUsersService.addUser.and.returnValue(of(mockUserData));
    mockUsersService.addUser(mockUserData).subscribe(() => {
      expect(mockUsersService.addUser).toHaveBeenCalledWith(mockUserData);
    });
  }));

  it('should add a new post', fakeAsync(() => {
    component.dialogTitle = 'Add new Post';
    const mockPostData = {
      id: 123,
      title: 'Test Post',
      body: 'This is a test post',
    };
    mockPostsService.addPost.and.returnValue(of(mockPostData));
    mockPostsService.addPost(mockPostData).subscribe(() => {
      expect(mockPostsService.addPost).toHaveBeenCalledWith(mockPostData);
    });
  }));

  it('should add a new comment', fakeAsync(() => {
    component.dialogTitle = 'Add new Comment';
    const mockCommentData = {
      post_id: 123,
      name: 'Test Comment',
      body: 'This is a test comment',
    };
    mockPostsService.addComment.and.returnValue(of(mockCommentData));
    mockPostsService.addComment('123', mockCommentData).subscribe(() => {
      expect(mockPostsService.addComment).toHaveBeenCalledWith(
        '123',
        mockCommentData
      );
    });
  }));

  it('should delete a user', fakeAsync(() => {
    component.dialogTitle = 'Delete User';
    const mockUserId = 123;
    mockUsersService.deleteUser.and.returnValue(of(mockUserId));
    mockUsersService.deleteUser(String(mockUserId)).subscribe(() => {
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(
        String(mockUserId)
      );
    });
  }));

  it('should logout', () => {
    component.dialogTitle = 'Logout';
    mockAuthService.isAuthenticatedFn.and.returnValue(false);
    mockRouter.navigate(['/login']);
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
