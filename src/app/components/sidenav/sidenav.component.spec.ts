import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import { AppModule } from '../../app.module';

import { SidenavComponent } from './sidenav.component';

import { MenuService } from '../../services/menu.service';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let mockMenuService: MenuService;

  class MockMenuService {
    openSidenavSubject = new Subject<void>();
    openSidenav$ = this.openSidenavSubject.asObservable();
    openSidenav() {
      this.openSidenavSubject.next();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [SidenavComponent],
      providers: [
        SidenavComponent,
        { provide: MenuService, useClass: MockMenuService },
      ],
    });

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    mockMenuService = TestBed.inject(MenuService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.isOpen).toBe(false);
  });

  it('should toggle isOpen when openSidenav is triggered', () => {
    fixture.detectChanges();
    mockMenuService.openSidenav();
    expect(component.isOpen).toBe(true);
    mockMenuService.openSidenav();
    expect(component.isOpen).toBe(false);
  });

  it('should subscribe to openSidenav$ from MenuService', () => {
    mockMenuService.openSidenav$.subscribe = jasmine.createSpy();
    fixture.detectChanges();
    mockMenuService.openSidenav();
    expect(mockMenuService.openSidenav$.subscribe).toHaveBeenCalled();
  });
});
