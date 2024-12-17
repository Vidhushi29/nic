import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bsp1repotComponent } from './bsp1repot.component';

describe('Bsp1repotComponent', () => {
  let component: Bsp1repotComponent;
  let fixture: ComponentFixture<Bsp1repotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bsp1repotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bsp1repotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
