import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';

import { UserDetailComponent } from './user-detail.component';
import { UsersService } from '../users.service';
import { PostsService } from '../../posts/posts.service';
import { DialogService } from '../../../services/dialog.service';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockUserService: any;
  let mockPostsService: any;
  let mockDialogService: any;

  beforeEach(() => {
    mockActivatedRoute = {
      paramMap: of(convertToParamMap({ id: '123' })),
    };
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserService = jasmine.createSpyObj('UsersService', ['getUsers']);
    mockPostsService = jasmine.createSpyObj('PostsService', [
      'getPosts',
      'getComments',
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', [
      'addCommentDialog',
    ]);

    TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: UsersService, useValue: mockUserService },
        { provide: PostsService, useValue: mockPostsService },
        { provide: DialogService, useValue: mockDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user and posts on init', () => {
    const mockUser = { id: 123, name: 'Test User' };
    const mockPosts = [
      { id: 1, title: 'Test Post 1' },
    ];
    const mockComments = [
      {
        id: 1,
        post_id: 1,
        name: 'Name 1',
        email: 'Email 1',
        body: 'Test Comment 1',
      }
    ];

    mockUserService.getUsers.and.returnValue(of({ body: [mockUser] }));
    mockPostsService.getPosts.and.returnValue(of({ body: mockPosts }));
    mockPostsService.getComments.and.returnValue(of({ body: mockComments }));

    component.ngOnInit();

    expect(mockUserService.getUsers).toHaveBeenCalledWith('?id=123');
    expect(mockPostsService.getPosts).toHaveBeenCalledWith('user_id=123');
    expect(mockPostsService.getComments).toHaveBeenCalledWith('post_id=1');

    expect(component.isLoading).toBe(false);
  });

  it('should navigate to user list on goBack', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user-list']);
  });
});
