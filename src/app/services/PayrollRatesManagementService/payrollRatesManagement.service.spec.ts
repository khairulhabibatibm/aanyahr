/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PayrollRatesManagementService } from './payrollRatesManagement.service';

describe('Service: PayrollRatesManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PayrollRatesManagementService]
    });
  });

  it('should ...', inject([PayrollRatesManagementService], (service: PayrollRatesManagementService) => {
    expect(service).toBeTruthy();
  }));
});
