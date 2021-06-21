/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeaveManagementService } from './leaveManagement.service';

describe('Service: LeaveManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveManagementService]
    });
  });

  it('should ...', inject([LeaveManagementService], (service: LeaveManagementService) => {
    expect(service).toBeTruthy();
  }));
});
