import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestreportPage } from './testreport.page';

describe('TestreportPage', () => {
  let component: TestreportPage;
  let fixture: ComponentFixture<TestreportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestreportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestreportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
