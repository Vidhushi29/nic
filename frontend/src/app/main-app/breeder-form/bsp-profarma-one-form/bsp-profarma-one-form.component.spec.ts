import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BspProfarmaOneFormComponent } from './bsp-profarma-one-form.component';

describe('BspProfarmaOneFormComponent', () => {
  let component: BspProfarmaOneFormComponent;
  let fixture: ComponentFixture<BspProfarmaOneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BspProfarmaOneFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BspProfarmaOneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
