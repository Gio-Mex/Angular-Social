import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Observable, map, of, switchMap } from 'rxjs';

import { DialogComponent } from '../../../components/dialog/dialog.component';

import { MatDialog } from '@angular/material/dialog';

import { UsersService } from '../users.service';
import { PostsService } from '../../posts/posts.service';
import { DialogService } from '../../../services/dialog.service';

import { User } from '../../../models/user';
import { Comment } from '../../../models/comment';
import { Post } from '../../../models/posts';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent {
  user$!: Observable<User>;
  posts$!: Observable<Post[]>;
  comments: Comment[] = [];
  isLoading!: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private postsService: PostsService,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getUser().subscribe((_user: any) => {
      this.user$ = of(_user.body[0]);
    });
    this.getPosts().subscribe((_posts: Post[]) => {
      if (_posts.length) {
      this.posts$ = of(_posts);
      for (let post of _posts) {
        this.getComments(post.id).subscribe((_comments: any) => {
          this.comments.push(..._comments.body);
          this.isLoading = false;
        });
      }
      } else {
        this.posts$ = of([]);
        this.isLoading = false;
      }
    });
  }

  getUser(): Observable<User> {
    return this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService.getUsers(`?id=${params.get('id')}`)
      )
    );
  }

  getPosts(): Observable<Post[]> {
    return this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.postsService.getPosts(`user_id=${params.get('id')}`)
      ),
      map((posts) => posts.body)
    );
  }

  getComments(post_id: number): Observable<Comment[]> {
    return this.postsService.getComments(`post_id=${post_id}`);
  }

  hasComments(post_id: number): boolean {
    return this.comments.some((comment) => comment.post_id === post_id);
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

  goBack(): void {
    this.router.navigate(['/user-list']);
  }
}
