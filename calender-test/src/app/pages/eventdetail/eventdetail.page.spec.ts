import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventdetailPage } from './eventdetail.page';

describe('EventdetailPage', () => {
  let component: EventdetailPage;
  let fixture: ComponentFixture<EventdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventdetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
