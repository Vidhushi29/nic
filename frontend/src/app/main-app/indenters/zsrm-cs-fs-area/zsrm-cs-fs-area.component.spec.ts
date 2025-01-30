import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsrmCsFsAreaComponent } from './zsrm-cs-fs-area.component';

describe('ZsrmCsFsAreaComponent', () => {
  let component: ZsrmCsFsAreaComponent;
  let fixture: ComponentFixture<ZsrmCsFsAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZsrmCsFsAreaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZsrmCsFsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
