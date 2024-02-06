import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppDataService } from '../../services/app-data.service';

import { User } from '../../models/user';

@Injectable({
  providedIn: 'any',
})
export class UsersService {
  pageSize = 10;
  title!: string;

  constructor(private appDataService: AppDataService) {}

  getUsers(query: any): Observable<any> {
    return this.appDataService.getData('/users' + query);
  }

  addUser(data: object): Observable<User> {
    return this.appDataService.postData('/users', data);
  }

  deleteUser(id: string): Observable<any> {
    return this.appDataService.deleteData(`/users/${id}`);
  }
}
