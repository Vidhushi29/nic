import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedInventoryComponent } from './seed-inventory.component';

describe('SeedInventoryComponent', () => {
  let component: SeedInventoryComponent;
  let fixture: ComponentFixture<SeedInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
