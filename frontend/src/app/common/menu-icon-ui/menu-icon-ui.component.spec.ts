import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuIconUiComponent } from './menu-icon-ui.component';

describe('MenuIconUiComponent', () => {
  let component: MenuIconUiComponent;
  let fixture: ComponentFixture<MenuIconUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuIconUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuIconUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
