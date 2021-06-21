/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmployeeCategoryManagementService } from './employeeCategoryManagement.service';

describe('Service: EmployeeCategoryManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeCategoryManagementService]
    });
  });

  it('should ...', inject([EmployeeCategoryManagementService], (service: EmployeeCategoryManagementService) => {
    expect(service).toBeTruthy();
  }));
});
