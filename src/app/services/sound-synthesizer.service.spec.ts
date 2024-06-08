import { TestBed } from '@angular/core/testing';

import { SoundSynthesizerService } from './SoundSynthesizerService';

describe('SoundSynthesizerService', () => {
  let service: SoundSynthesizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundSynthesizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
