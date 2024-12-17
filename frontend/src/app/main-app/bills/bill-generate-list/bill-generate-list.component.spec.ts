import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillGenerateListComponent } from './bill-generate-list.component';

describe('BillGenerateListComponent', () => {
  let component: BillGenerateListComponent;
  let fixture: ComponentFixture<BillGenerateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillGenerateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillGenerateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
