import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfBreadcrumb } from './tf-breadcrumb';

describe('TfBreadcrumb', () => {
  let component: TfBreadcrumb;
  let fixture: ComponentFixture<TfBreadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TfBreadcrumb]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfBreadcrumb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
