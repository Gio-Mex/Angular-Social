import { TestBed } from '@angular/core/testing';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';

import { AuthService } from './auth.service';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: Router;
  let state = {} as RouterStateSnapshot;
  let route = {} as ActivatedRouteSnapshot;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    const AuthServiceSpy = jasmine.createSpyObj(['isAuthenticatedFn']);
    mockRouter = jasmine.createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: AuthServiceSpy },
      ],
    });
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to login if not authenticated', () => {
    mockAuthService.isAuthenticatedFn.and.returnValue(false);
    state = { url: '/user-list' } as RouterStateSnapshot;
    route = {} as ActivatedRouteSnapshot;

    const result = executeGuard(route, state);
    expect(result).toEqual(mockRouter.navigate(['/']));
  });

  it('should allow access if authenticated', () => {
    mockAuthService.isAuthenticatedFn.and.returnValue(true);
    state = { url: '/user-list' } as RouterStateSnapshot;
    route = {} as ActivatedRouteSnapshot;

    const result = executeGuard(route, state);
    expect(result).toEqual(true);
    expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/']);
  });
});
