import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeddivisonspawisereportComponent } from './seeddivisonspawisereport.component';

describe('SeeddivisonspawisereportComponent', () => {
  let component: SeeddivisonspawisereportComponent;
  let fixture: ComponentFixture<SeeddivisonspawisereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeeddivisonspawisereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeddivisonspawisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
