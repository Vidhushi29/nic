import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillGenerateFormComponent } from './bill-generate-form.component';

describe('BillGenerateFormComponent', () => {
  let component: BillGenerateFormComponent;
  let fixture: ComponentFixture<BillGenerateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillGenerateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillGenerateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
