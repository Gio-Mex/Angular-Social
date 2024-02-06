import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private openSidenavSubject = new Subject<void>();
  openSidenav$ = this.openSidenavSubject.asObservable();

  openSidenav() {
    this.openSidenavSubject.next();
  }
}
