import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederSeedProductionCentreComponent } from './breeder-seed-production-centre.component';

describe('BreederSeedProductionCentreComponent', () => {
  let component: BreederSeedProductionCentreComponent;
  let fixture: ComponentFixture<BreederSeedProductionCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederSeedProductionCentreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederSeedProductionCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
