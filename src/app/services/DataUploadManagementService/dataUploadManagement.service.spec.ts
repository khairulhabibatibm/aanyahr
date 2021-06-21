/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataUploadManagementService } from './dataUploadManagement.service';

describe('Service: DataUploadManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataUploadManagementService]
    });
  });

  it('should ...', inject([DataUploadManagementService], (service: DataUploadManagementService) => {
    expect(service).toBeTruthy();
  }));
});
