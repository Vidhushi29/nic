import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bsp2reportComponent } from './bsp2report.component';

describe('Bsp2reportComponent', () => {
  let component: Bsp2reportComponent;
  let fixture: ComponentFixture<Bsp2reportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bsp2reportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bsp2reportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
