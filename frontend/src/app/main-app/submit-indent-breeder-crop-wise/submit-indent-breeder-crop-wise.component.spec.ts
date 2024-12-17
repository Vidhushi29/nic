import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitIndentBreederCropWiseComponent } from './submit-indent-breeder-crop-wise.component';

describe('SubmitIndentBreederCropWiseComponent', () => {
  let component: SubmitIndentBreederCropWiseComponent;
  let fixture: ComponentFixture<SubmitIndentBreederCropWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitIndentBreederCropWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitIndentBreederCropWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
