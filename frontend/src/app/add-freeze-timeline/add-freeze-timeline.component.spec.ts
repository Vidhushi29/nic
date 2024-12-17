import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreezeTimelineComponent } from './add-freeze-timeline.component';

describe('AddFreezeTimelineComponent', () => {
  let component: AddFreezeTimelineComponent;
  let fixture: ComponentFixture<AddFreezeTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFreezeTimelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFreezeTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
