import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitIndentsBreederSeedsComponent } from './submit-indents-breeder-seeds.component';

describe('SubmitIndentsBreederSeedsComponent', () => {
  let component: SubmitIndentsBreederSeedsComponent;
  let fixture: ComponentFixture<SubmitIndentsBreederSeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitIndentsBreederSeedsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitIndentsBreederSeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
