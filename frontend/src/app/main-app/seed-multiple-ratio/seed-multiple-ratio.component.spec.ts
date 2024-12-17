import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedMultipleRatioComponent } from './seed-multiple-ratio.component';

describe('SeedMultipleRatioComponent', () => {
  let component: SeedMultipleRatioComponent;
  let fixture: ComponentFixture<SeedMultipleRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedMultipleRatioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedMultipleRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
