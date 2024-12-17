import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederSeedInventoryComponent } from './breeder-seed-inventory.component';

describe('BreederSeedInventoryComponent', () => {
  let component: BreederSeedInventoryComponent;
  let fixture: ComponentFixture<BreederSeedInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederSeedInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederSeedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
