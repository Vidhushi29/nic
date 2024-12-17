import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedProcesingPlantComponent } from './seed-procesing-plant.component';

describe('SeedProcesingPlantComponent', () => {
  let component: SeedProcesingPlantComponent;
  let fixture: ComponentFixture<SeedProcesingPlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedProcesingPlantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedProcesingPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
