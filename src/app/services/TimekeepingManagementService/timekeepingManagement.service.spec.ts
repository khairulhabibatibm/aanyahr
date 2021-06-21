/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimekeepingManagementService } from './timekeepingManagement.service';

describe('Service: TimekeepingManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimekeepingManagementService]
    });
  });

  it('should ...', inject([TimekeepingManagementService], (service: TimekeepingManagementService) => {
    expect(service).toBeTruthy();
  }));
});
