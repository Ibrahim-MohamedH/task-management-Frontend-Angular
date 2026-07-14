import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfPagination } from './tf-pagination';

describe('TfPagination', () => {
  let component: TfPagination;
  let fixture: ComponentFixture<TfPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TfPagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfPagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
