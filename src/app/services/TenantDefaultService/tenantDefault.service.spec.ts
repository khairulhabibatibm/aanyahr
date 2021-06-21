/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TenantDefaultService } from './tenantDefault.service';

describe('Service: TenantDefault', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TenantDefaultService]
    });
  });

  it('should ...', inject([TenantDefaultService], (service: TenantDefaultService) => {
    expect(service).toBeTruthy();
  }));
});
