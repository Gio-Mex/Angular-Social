import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { map } from 'rxjs';

import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostsService]
    });

    service = TestBed.inject(PostsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve posts', () => {
    const mockQuery = 'userId=1';
    const mockResponse = [{ id: 1, title: 'Post 1'}];
    service.getPosts(mockQuery)
    .pipe(map(res => res.body))
    .subscribe(posts => {
      expect(posts).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('https://gorest.co.in/public/v2/posts?' + mockQuery);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should add a post', () => {
    const mockData = { title: 'New Post', body: 'This is a new post' };

    service.addPost(mockData).subscribe(post => {
      expect(post).toEqual(mockData);
    });

    const req = httpTestingController.expectOne('https://gorest.co.in/public/v2/posts');
    expect(req.request.method).toEqual('POST');
    req.flush(mockData);
  });

  it('should retrieve comments', () => {
    const mockQuery = 'postId=1';
    const mockResponse = [{ id: 1, body: 'Comment 1' }, { id: 2, body: 'Comment 2' }];

    service.getComments(mockQuery)
    .pipe(map(res => res.body))
    .subscribe(comments => {
      expect(comments).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('https://gorest.co.in/public/v2/comments?' + mockQuery);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should add a comment', () => {
    const postId = '1';
    const mockData = { body: 'New Comment' };

    service.addComment(postId, mockData).subscribe(comment => {
      expect(comment).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(`https://gorest.co.in/public/v2/posts/${postId}/comments`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockData);
  });
});