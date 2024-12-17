import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaOfBreederSeedTagListComponent } from './performa-of-breeder-seed-tag-list.component';

describe('PerformaOfBreederSeedTagListComponent', () => {
  let component: PerformaOfBreederSeedTagListComponent;
  let fixture: ComponentFixture<PerformaOfBreederSeedTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformaOfBreederSeedTagListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformaOfBreederSeedTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
