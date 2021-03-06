/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimekeepingComponent } from './timekeeping.component';

describe('TimekeepingComponent', () => {
  let component: TimekeepingComponent;
  let fixture: ComponentFixture<TimekeepingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimekeepingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimekeepingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
