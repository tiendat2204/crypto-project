/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Bai2vipComponent } from './bai2vip.component';

describe('Bai2vipComponent', () => {
  let component: Bai2vipComponent;
  let fixture: ComponentFixture<Bai2vipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bai2vipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bai2vipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
