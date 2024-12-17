import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederSeedSubmissionComponent } from './breeder-seed-submission.component';

describe('BreederSeedSubmissionComponent', () => {
  let component: BreederSeedSubmissionComponent;
  let fixture: ComponentFixture<BreederSeedSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederSeedSubmissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederSeedSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
