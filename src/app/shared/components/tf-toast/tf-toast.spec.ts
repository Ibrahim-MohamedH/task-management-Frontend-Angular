import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfToast } from './tf-toast';

describe('TfToast', () => {
  let component: TfToast;
  let fixture: ComponentFixture<TfToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TfToast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfToast);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
