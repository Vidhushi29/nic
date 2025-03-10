import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsrmfstocsComponent } from './zsrmfstocs.component';

describe('ZsrmfstocsComponent', () => {
  let component: ZsrmfstocsComponent;
  let fixture: ComponentFixture<ZsrmfstocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZsrmfstocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZsrmfstocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
