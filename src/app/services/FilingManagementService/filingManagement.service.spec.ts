/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FilingManagementService } from './filingManagement.service';

describe('Service: FilingManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilingManagementService]
    });
  });

  it('should ...', inject([FilingManagementService], (service: FilingManagementService) => {
    expect(service).toBeTruthy();
  }));
});
