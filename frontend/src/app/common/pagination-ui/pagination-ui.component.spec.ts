import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationUiComponent } from './pagination-ui.component';

describe('PaginationUiComponent', () => {
  let component: PaginationUiComponent;
  let fixture: ComponentFixture<PaginationUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
