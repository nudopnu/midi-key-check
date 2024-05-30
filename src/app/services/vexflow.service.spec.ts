import { TestBed } from '@angular/core/testing';

import { VexflowService } from './VexflowService';

describe('VexflowService', () => {
  let service: VexflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VexflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
