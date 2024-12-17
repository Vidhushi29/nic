import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSlipComponent } from './sample-slip.component';

describe('SampleSlipComponent', () => {
  let component: SampleSlipComponent;
  let fixture: ComponentFixture<SampleSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
