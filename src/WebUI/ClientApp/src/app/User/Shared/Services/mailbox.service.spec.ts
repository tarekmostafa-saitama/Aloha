import { TestBed } from '@angular/core/testing';

import { MailboxService } from './mailbox.service';

describe('MailboxService', () => {
  let service: MailboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailboxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
