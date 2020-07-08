import { TestBed } from '@angular/core/testing';

import { MediaRecordingService } from './media-recording.service';

describe('MediaRecordingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MediaRecordingService = TestBed.get(MediaRecordingService);
    expect(service).toBeTruthy();
  });
});
