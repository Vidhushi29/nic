import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaOfBreederSeedTagComponent } from './performa-of-breeder-seed-tag.component';

describe('PerformaOfBreederSeedTagComponent', () => {
  let component: PerformaOfBreederSeedTagComponent;
  let fixture: ComponentFixture<PerformaOfBreederSeedTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformaOfBreederSeedTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformaOfBreederSeedTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
