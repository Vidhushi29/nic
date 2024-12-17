import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalForReprintTagsComponent } from './approval-for-reprint-tags.component';

describe('ApprovalForReprintTagsComponent', () => {
  let component: ApprovalForReprintTagsComponent;
  let fixture: ComponentFixture<ApprovalForReprintTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalForReprintTagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalForReprintTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
