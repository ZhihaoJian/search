import { TestBed, inject } from '@angular/core/testing';

import { CurrentFileServiceService } from './current-file-service.service';

describe('CurrentFileServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentFileServiceService]
    });
  });

  it('should be created', inject([CurrentFileServiceService], (service: CurrentFileServiceService) => {
    expect(service).toBeTruthy();
  }));
});
