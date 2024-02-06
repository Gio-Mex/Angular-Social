import { ComponentFixture, TestBed } from '@angular/core/testing';
import { map, of } from 'rxjs';

import { PostListComponent } from './post-list.component';

import { PostsModule } from '../posts.module';

import { PostsService } from '../posts.service';
import { UsersService } from '../../users/users.service';

import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let mockPostsService: jasmine.SpyObj<PostsService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  const mockPosts = {
    body: [
      {
        id: 1,
        title: 'Post 1',
        body: 'Body 1',
        user_id: 1,
      },
    ],
    count: 1,
  };
  const mockUsers = {
    body: [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
        gender: 'male',
        status: 'active',
      },
    ],
    count: 1,
  };
  const mockComments = {
    body: [
      {
        name: 'Tim Doe',
        body: 'Body 1',
        post_id: 1,
      },
    ],
    count: 1,
  };
  const mockPageEvent: PageEvent = {
    length: 100,
    pageIndex: 1,
    pageSize: 10,
    previousPageIndex: 0,
  };

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', [
      'getPosts',
      'getComments',
    ]);
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [PostsModule],
      declarations: [PostListComponent],
      providers: [
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PostListComponent);
        component = fixture.componentInstance;
        mockPostsService = TestBed.inject(
          PostsService
        ) as jasmine.SpyObj<PostsService>;
        mockUsersService = TestBed.inject(
          UsersService
        ) as jasmine.SpyObj<UsersService>;
        mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get posts', () => {
    mockPostsService.getPosts.and.returnValue(of(mockPosts));
    mockUsersService.getUsers.and.returnValue(of(mockUsers));
    spyOn(component, 'getComments').and.returnValue(
      of([{ post_id: 1, content: 'Great post!' }])
    );
    component.getPosts('url');
    component.postAuthors = new Map<number, string>([
      [mockPosts.body[0].user_id, mockUsers.body[0].name],
    ]);
    expect(component.postsCount).toBe(1);
    component.posts$.subscribe((posts) => {
      expect(posts).toEqual(mockPosts.body);
    });
    expect(component.postAuthors).toEqual(
      new Map<number, string>([[1, 'John Doe']])
    );
    expect(component.comments.length).toBe(1);
    expect(component.noPosts).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('should set isLoading and noPosts flags appropriately when no posts are found', () => {
    const mockPosts = {
      body: [],
    };
    mockPostsService.getPosts.and.returnValue(of(mockPosts));

    component.getPosts('url');
    expect(component.noPosts).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  it('should get comments', () => {
    mockPostsService.getPosts.and.returnValue(of(mockPosts));
    mockPostsService.getComments.and.returnValue(of(mockComments));
    component
      .getComments(1)
      .pipe(
        map((response) => {
          component.comments = response;
        })
      )
      .subscribe();
    expect(component.comments[0].name).toBe('Tim Doe');
    expect(component.comments[0].body).toBe('Body 1');
    expect(component.comments[0].post_id).toBe(1);
    expect(component.comments.length).toBe(1);
  });

  it('should search posts by title', () => {
    mockPostsService.getPosts.and.returnValue(of(mockPosts));
    mockUsersService.getUsers.and.returnValue(of(mockUsers));
    spyOn(component, 'getComments').and.returnValue(
      of([{ post_id: 1, content: 'Great post!' }])
    );
    component.searchPost('Post 1');
    expect(component.postsCount).toBe(1);
    component.posts$.subscribe((posts) => {
      expect(posts).toEqual([
        {
          id: 1,
          title: 'Post 1',
          body: 'Body 1',
          user_id: 1,
        },
      ]);
    });
    expect(component.comments.length).toBe(1);
    expect(component.noPosts).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('should open the addPost dialog', () => {
    component.addPostDialog();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('sholud open the addComment dialog', () => {
    component.addCommentDialog(1);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should handle the page event', () => {
    mockPostsService.getPosts.and.returnValue(of(mockPosts));
    mockUsersService.getUsers.and.returnValue(of(mockUsers));
    spyOn(component, 'getComments').and.returnValue(
      of([{ post_id: 1, content: 'Great post!' }])
    );

    component.onPageChange(mockPageEvent);

    expect(component.pageSize).toEqual(mockPageEvent.pageSize);
    expect(component.pageNumber).toEqual(mockPageEvent.pageIndex + 1);
    expect(component.comments.length).toBe(1);
  });
});
