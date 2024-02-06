import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
  });

  it('should set and retrieve bearer token', () => {
    const token = 'example_token';
    service.setBearerToken(token);
    expect(service.bearerToken).toEqual(token);
    expect(localStorage.getItem('bearerToken:')).toEqual(token);
  });

  it('should return true if authenticated', () => {
    const token = 'example_token';
    localStorage.setItem('bearerToken:', token);
    localStorage.setItem('user.email:', 'example@example.com');
    expect(service.isAuthenticatedFn()).toBe(true);
  });

  it('should return false if not authenticated', () => {
    localStorage.clear();
    expect(service.isAuthenticatedFn()).toBe(false);
  });
});
