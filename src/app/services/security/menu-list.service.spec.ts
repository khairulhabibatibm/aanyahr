/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MenuListService } from './menu-list.service';

describe('Service: MenuList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuListService]
    });
  });

  it('should ...', inject([MenuListService], (service: MenuListService) => {
    expect(service).toBeTruthy();
  }));
});
