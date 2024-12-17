import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalDasboadSecondComponent } from './nodal-dasboad-second.component';

describe('NodalDasboadSecondComponent', () => {
  let component: NodalDasboadSecondComponent;
  let fixture: ComponentFixture<NodalDasboadSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodalDasboadSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodalDasboadSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
