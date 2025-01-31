import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsrmbstofsComponent } from './zsrmbstofs.component';

describe('ZsrmbstofsComponent', () => {
  let component: ZsrmbstofsComponent;
  let fixture: ComponentFixture<ZsrmbstofsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZsrmbstofsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZsrmbstofsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
