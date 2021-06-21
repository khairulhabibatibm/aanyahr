/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HolidayManagementService } from './holidayManagement.service';

describe('Service: HolidayManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HolidayManagementService]
    });
  });

  it('should ...', inject([HolidayManagementService], (service: HolidayManagementService) => {
    expect(service).toBeTruthy();
  }));
});
