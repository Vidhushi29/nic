import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprintTagComponent } from './reprint-tag.component';

describe('ReprintTagComponent', () => {
  let component: ReprintTagComponent;
  let fixture: ComponentFixture<ReprintTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprintTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprintTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
