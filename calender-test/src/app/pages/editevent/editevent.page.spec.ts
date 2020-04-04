import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditeventPage } from './editevent.page';

describe('EditeventPage', () => {
  let component: EditeventPage;
  let fixture: ComponentFixture<EditeventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditeventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditeventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
