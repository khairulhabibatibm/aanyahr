/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BranchManagementService } from './branchManagement.service';

describe('Service: BranchManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BranchManagementService]
    });
  });

  it('should ...', inject([BranchManagementService], (service: BranchManagementService) => {
    expect(service).toBeTruthy();
  }));
});
