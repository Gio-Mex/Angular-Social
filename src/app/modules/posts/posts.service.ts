import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AppDataService } from '../../services/app-data.service';

@Injectable({
  providedIn: 'any'
})
export class PostsService {
  postId: any;
  pageSize!: number;

  constructor(private appDataService: AppDataService) {}

  getPosts(query: any): Observable<any> {
    return this.appDataService.getData('/posts?' + query);
  }

  addPost(data: object): Observable<any> {
    return this.appDataService.postData('/posts', data);
  }

  getComments(query: any): Observable<any> {
    return this.appDataService.getData('/comments?' + query);
  }

  addComment(post_id : string, data: object): Observable<any> {
    return this.appDataService.postData(`/posts/${post_id}/comments`, data);
  }
}
