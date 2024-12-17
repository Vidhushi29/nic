import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfreezeIndentComponent } from './unfreeze-indent.component';

describe('UnfreezeIndentComponent', () => {
  let component: UnfreezeIndentComponent;
  let fixture: ComponentFixture<UnfreezeIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnfreezeIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnfreezeIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
