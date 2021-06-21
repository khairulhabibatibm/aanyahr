/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReportManagementService } from './reportManagement.service';

describe('Service: ReportManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportManagementService]
    });
  });

  it('should ...', inject([ReportManagementService], (service: ReportManagementService) => {
    expect(service).toBeTruthy();
  }));
});
