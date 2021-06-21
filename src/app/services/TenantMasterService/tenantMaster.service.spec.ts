/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TenantMasterService } from './tenantMaster.service';

describe('Service: TenantMaster', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenantMasterService]
    });
  });

  it('should ...', inject([TenantMasterService], (service: TenantMasterService) => {
    expect(service).toBeTruthy();
  }));
});
