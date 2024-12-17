import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedTestingLabaratoryFormComponent } from './seed-testing-labaratory-form.component';

describe('SeedTestingLabaratoryFormComponent', () => {
  let component: SeedTestingLabaratoryFormComponent;
  let fixture: ComponentFixture<SeedTestingLabaratoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedTestingLabaratoryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedTestingLabaratoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
