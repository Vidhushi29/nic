import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeddivisionindentwiseComponent } from './seeddivisionindentwise.component';

describe('SeeddivisionindentwiseComponent', () => {
  let component: SeeddivisionindentwiseComponent;
  let fixture: ComponentFixture<SeeddivisionindentwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeeddivisionindentwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeddivisionindentwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
