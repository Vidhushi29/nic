import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedMultiplicationRatioListComponent } from './seed-multiplication-ratio-list.component';

describe('SeedMultiplicationRatioListComponent', () => {
  let component: SeedMultiplicationRatioListComponent;
  let fixture: ComponentFixture<SeedMultiplicationRatioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedMultiplicationRatioListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedMultiplicationRatioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
