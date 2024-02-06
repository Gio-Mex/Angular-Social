import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
class MockMenuService {
  openSidenavSubject = new Subject<void>();
  openSidenav$ = this.openSidenavSubject.asObservable();
  openSidenav() {
    this.openSidenavSubject.next();
  }
}
describe('MenuService', () => {
  let service: MockMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockMenuService],
    });

    service = TestBed.inject(MockMenuService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should emit openSidenav event', () => {
    const spy = spyOn(service.openSidenavSubject, 'next');
    service.openSidenav();
    expect(spy).toHaveBeenCalled();
  });

  it('should subscribe to openSidenav$ observable', () => {
    const spy = jasmine.createSpy('openSidenavSpy');
    service.openSidenav$.subscribe(spy);
    service.openSidenav();
    expect(spy).toHaveBeenCalled();
  });
});
