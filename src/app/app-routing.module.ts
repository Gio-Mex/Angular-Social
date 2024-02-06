import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'user-list',
    loadChildren: () =>
      import('./modules/users/users.module').then((m) => m.UsersModule),
    canActivate: [authGuard],
  },
  {
    path: 'post-list',
    loadChildren: () =>
      import('./modules/posts/posts.module').then((m) => m.PostsModule),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      /*{ enableTracing: true }*/ // <-- debugging purposes only
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
