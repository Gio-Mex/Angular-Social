import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppDataService } from './app-data.service';
import { map } from 'rxjs';

describe('AppDataService', () => {
  let service: AppDataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppDataService],
    });

    service = TestBed.inject(AppDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve data', () => {
    const mockResponse = { body: [{ id: 1, name: 'John' }], count: 1 };

    service
      .getData('/example')
      .pipe(map((res) => res.body))
      .subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

    const req = httpTestingController.expectOne(
      'https://gorest.co.in/public/v2/example'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should post data', () => {
    const mockData = { id: 1, name: 'John' };

    service.postData('/example', mockData).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(
      'https://gorest.co.in/public/v2/example'
    );
    expect(req.request.method).toEqual('POST');
    req.flush(mockData);
  });

  it('should delete data', () => {
    const mockResponse = { message: 'Deleted successfully' };

    service.deleteData('/example').subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      'https://gorest.co.in/public/v2/example'
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockResponse);
  });
});
