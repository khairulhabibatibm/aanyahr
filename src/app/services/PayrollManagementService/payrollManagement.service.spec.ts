/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PayrollManagementService } from './payrollManagement.service';

describe('Service: PayrollManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PayrollManagementService]
    });
  });

  it('should ...', inject([PayrollManagementService], (service: PayrollManagementService) => {
    expect(service).toBeTruthy();
  }));
});
