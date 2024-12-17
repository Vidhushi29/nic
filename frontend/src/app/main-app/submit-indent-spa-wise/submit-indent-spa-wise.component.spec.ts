import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitIndentSpaWiseComponent } from './submit-indent-spa-wise.component';

describe('SubmitIndentSpaWiseComponent', () => {
  let component: SubmitIndentSpaWiseComponent;
  let fixture: ComponentFixture<SubmitIndentSpaWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitIndentSpaWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitIndentSpaWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
