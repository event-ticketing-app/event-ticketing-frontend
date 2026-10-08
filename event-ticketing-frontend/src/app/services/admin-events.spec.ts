import { TestBed } from '@angular/core/testing';

import { AdminEvents } from './admin-events';

describe('AdminEvents', () => {
  let service: AdminEvents;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminEvents);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
