/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MasterTemplateService } from './masterTemplate.service';

describe('Service: MasterTemplate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterTemplateService]
    });
  });

  it('should ...', inject([MasterTemplateService], (service: MasterTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
