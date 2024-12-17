import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedRegisterOldStockComponent } from './processed-register-old-stock.component';

describe('ProcessedRegisterOldStockComponent', () => {
  let component: ProcessedRegisterOldStockComponent;
  let fixture: ComponentFixture<ProcessedRegisterOldStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessedRegisterOldStockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessedRegisterOldStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
