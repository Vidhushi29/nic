import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspcassigncropComponent } from './bspcassigncrop.component';

describe('BspcassigncropComponent', () => {
  let component: BspcassigncropComponent;
  let fixture: ComponentFixture<BspcassigncropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspcassigncropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspcassigncropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
