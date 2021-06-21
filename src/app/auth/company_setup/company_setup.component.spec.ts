/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Company_setupComponent } from './company_setup.component';

describe('Company_setupComponent', () => {
  let component: Company_setupComponent;
  let fixture: ComponentFixture<Company_setupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Company_setupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Company_setupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
