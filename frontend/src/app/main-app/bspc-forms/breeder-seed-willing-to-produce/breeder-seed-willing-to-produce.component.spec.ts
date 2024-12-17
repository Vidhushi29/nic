import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederSeedWillingToProduceComponent } from './breeder-seed-willing-to-produce.component';

describe('BreederSeedWillingToProduceComponent', () => {
  let component: BreederSeedWillingToProduceComponent;
  let fixture: ComponentFixture<BreederSeedWillingToProduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederSeedWillingToProduceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederSeedWillingToProduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
