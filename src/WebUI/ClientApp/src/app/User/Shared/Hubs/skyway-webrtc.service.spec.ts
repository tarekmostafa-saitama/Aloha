import { TestBed } from '@angular/core/testing';

import { SkywayWebrtcService } from './skyway-webrtc.service';

describe('SkywayWebrtcService', () => {
  let service: SkywayWebrtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkywayWebrtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
