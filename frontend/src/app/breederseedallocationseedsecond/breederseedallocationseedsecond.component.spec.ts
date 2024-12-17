import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreederseedallocationseedsecondComponent } from './breederseedallocationseedsecond.component';

describe('BreederseedallocationseedsecondComponent', () => {
  let component: BreederseedallocationseedsecondComponent;
  let fixture: ComponentFixture<BreederseedallocationseedsecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreederseedallocationseedsecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreederseedallocationseedsecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
