import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceTagComponent } from './trace-tag.component';

describe('TraceTagComponent', () => {
  let component: TraceTagComponent;
  let fixture: ComponentFixture<TraceTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraceTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraceTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
