import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowOutTestSampleReceptionComponent } from './grow-out-test-sample-reception.component';

describe('GrowOutTestSampleReceptionComponent', () => {
  let component: GrowOutTestSampleReceptionComponent;
  let fixture: ComponentFixture<GrowOutTestSampleReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowOutTestSampleReceptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrowOutTestSampleReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
