import { TestBed } from '@angular/core/testing';

import { SealightsService } from './sealights.service';

describe('SealightsService', () => {
  let service: SealightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SealightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
