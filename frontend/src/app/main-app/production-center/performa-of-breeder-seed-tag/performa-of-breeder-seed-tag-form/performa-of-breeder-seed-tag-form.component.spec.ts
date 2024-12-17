import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaOfBreederSeedTagFormComponent } from './performa-of-breeder-seed-tag-form.component';

describe('PerformaOfBreederSeedTagFormComponent', () => {
  let component: PerformaOfBreederSeedTagFormComponent;
  let fixture: ComponentFixture<PerformaOfBreederSeedTagFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformaOfBreederSeedTagFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformaOfBreederSeedTagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
