import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrpComponent } from './srp.component';

describe('SrpComponent', () => {
  let component: SrpComponent;
  let fixture: ComponentFixture<SrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
