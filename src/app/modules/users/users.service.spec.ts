import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { map } from 'rxjs';

import { UsersService } from './users.service';
import { AppDataService } from '../../services/app-data.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, AppDataService]
    });

    service = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve users', () => {
    const mockQuery = 'page=1&limit=10';
    const mockResponse = [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }];

    service.getUsers(mockQuery)
    .pipe(map(res => res.body))
    .subscribe(users => {
      expect(users).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('https://gorest.co.in/public/v2/users' + mockQuery);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should add a user', () => {
    const mockData = { id: '3', name: 'New User', email: 'newuser@example.com', gender: 'male', status: 'active' };
    const mockResponse = { id: 3, name: 'New User', email: 'newuser@example.com', gender: 'male', status: 'active' };

    service.addUser(mockData).subscribe(user => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should delete a user', () => {
    const userId = '3';

    service.deleteUser(userId).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpTestingController.expectOne(`https://gorest.co.in/public/v2/users/${userId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({ success: true });
  });
});