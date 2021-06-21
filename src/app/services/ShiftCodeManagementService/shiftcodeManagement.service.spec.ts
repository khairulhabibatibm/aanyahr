/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShiftcodeManagementService } from './shiftcodeManagement.service';

describe('Service: ShiftcodeManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShiftcodeManagementService]
    });
  });

  it('should ...', inject([ShiftcodeManagementService], (service: ShiftcodeManagementService) => {
    expect(service).toBeTruthy();
  }));
});
