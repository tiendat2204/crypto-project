/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Bai3vipComponent } from './bai3vip.component';

describe('Bai3vipComponent', () => {
  let component: Bai3vipComponent;
  let fixture: ComponentFixture<Bai3vipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bai3vipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bai3vipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
