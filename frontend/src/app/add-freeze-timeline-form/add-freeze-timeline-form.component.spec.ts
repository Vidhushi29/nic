import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreezeTimelineFormComponent } from './add-freeze-timeline-form.component';

describe('AddFreezeTimelineFormComponent', () => {
  let component: AddFreezeTimelineFormComponent;
  let fixture: ComponentFixture<AddFreezeTimelineFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFreezeTimelineFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFreezeTimelineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
