import { TestBed } from '@angular/core/testing';

import { HttpSpinnerInterceptor } from './http-spinner-interceptor';

describe('HttpSpinnerInterceptorService', () => {
  let service: HttpSpinnerInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSpinnerInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
