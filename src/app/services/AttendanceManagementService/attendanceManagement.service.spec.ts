/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AttendanceManagementService } from './attendanceManagement.service';

describe('Service: AttendanceManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttendanceManagementService]
    });
  });

  it('should ...', inject([AttendanceManagementService], (service: AttendanceManagementService) => {
    expect(service).toBeTruthy();
  }));
});
