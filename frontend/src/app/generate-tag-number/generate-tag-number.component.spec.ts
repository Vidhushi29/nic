import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTagNumberComponent } from './generate-tag-number.component';

describe('GenerateTagNumberComponent', () => {
  let component: GenerateTagNumberComponent;
  let fixture: ComponentFixture<GenerateTagNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateTagNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateTagNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
