import { Component, ElementRef } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { DialogComponent } from '../../../components/dialog/dialog.component';

import { Comment } from '../../../models/comment';

import { PostsService } from '../posts.service';
import { UsersService } from '../../users/users.service';
import { DialogService } from '../../../services/dialog.service';

import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  posts$: Observable<any> = of([]);
  comments: Comment[] = [];
  pageSize = 10;
  pageNumber = 1;
  postsCount!: number;
  openInput: boolean = false;
  postTitle= '';
  postAuthors = new Map<number, string>();
  noPosts!: boolean;
  isLoading!: boolean;
  
  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(){
    this.isLoading = true;
    this.noPosts = false;
    this.postTitle = '';
    this.postsService.pageSize = this.pageSize;
    this.comments = [];
    this.getPosts('');
  }

  getPosts(query: string): void {
    this.postsService
      .getPosts(query + `&per_page=${this.pageSize}`)
      .subscribe((_posts) => {
        if (_posts.body.length == 0) {
          this.noPosts = true;
          this.isLoading = false;
        } else {
          this.noPosts = false;
        this.posts$ = of(_posts.body);
        this.postsCount = _posts.count;
        for (let post of _posts.body) {
          this.usersService.getUsers(`/${post.user_id}/`).subscribe((user) => {
            const author = user.body.name;
            this.postAuthors.set(post.id, author);
          });
          this.getComments(post.id).subscribe((_comments) => {;
           this.comments.push(..._comments);
           this.noPosts = false;
           this.isLoading = false;
          });
        }
        }

      });
  }

  getComments(post_id: number): Observable<any> {
    return this.postsService.getComments(`post_id=${post_id}`).pipe(
      map((response) => {
        return response.body;
      })
    );
  }

  hasComments(post_id: number): boolean {
    return this.comments.some((comment) => comment.post_id === post_id);
  }

  getCommentsForPost(post_id: number): Comment[] {
    return this.comments.filter((comment) => comment.post_id === post_id);
  }

  searchPost(postTitle: string) {
    this.comments = [];
    this.getPosts(`title=${postTitle}`);
  }
  
  addPostDialog(): void {
    this.dialogService.dialogTitle = 'Add new Post';
    this.dialogService.field1Label = 'Title';
    this.dialogService.field2Label = 'Body';
    this.dialog.open(DialogComponent, {
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      width: '100%',
    });
  }

  addCommentDialog(post_id: any): void {
    this.dialogService.postId = post_id;
    this.dialogService.dialogTitle = 'Add new Comment';
    this.dialogService.field1Label = 'Comment';
    this.dialog.open(DialogComponent, {
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      width: '100%',
    });
  }

  onPageChange(event: PageEvent): void {
    this.comments = [];
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.getPosts(`title=${this.postTitle}&page=${this.pageNumber}`)
    this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth'});
  }
}