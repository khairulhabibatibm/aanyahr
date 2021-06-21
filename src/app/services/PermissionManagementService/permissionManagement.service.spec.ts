/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PermissionManagementService } from './permissionManagement.service';

describe('Service: PermissionManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionManagementService]
    });
  });

  it('should ...', inject([PermissionManagementService], (service: PermissionManagementService) => {
    expect(service).toBeTruthy();
  }));
});
