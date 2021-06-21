/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimekeepingGenerationDetailComponent } from './timekeeping-generation-detail.component';

describe('TimekeepingGenerationDetailComponent', () => {
  let component: TimekeepingGenerationDetailComponent;
  let fixture: ComponentFixture<TimekeepingGenerationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimekeepingGenerationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimekeepingGenerationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
