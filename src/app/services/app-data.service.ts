import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  baseUrl = 'https://gorest.co.in/public/v2';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getData(url: string): Observable<any> {
    return this.http
      .get(this.baseUrl + url, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.authService.bearerToken,
        }),
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          const _count = response.headers.get('x-pagination-total');
          return { body: response.body, count: _count };
        })
      );
  }

  postData(url: string, data: object): Observable<any> {
    return this.http.post(this.baseUrl + url, data, {
      headers: {
        Authorization: 'Bearer ' + this.authService.bearerToken,
      },
    });
  }

  deleteData(url: string): Observable<any> {
    return this.http.delete(this.baseUrl + url, {
      headers: {
        Authorization: 'Bearer ' + this.authService.bearerToken,
      },
    });
  }
}
