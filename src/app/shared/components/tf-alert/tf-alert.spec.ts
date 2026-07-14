import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfAlert } from './tf-alert';

describe('TfAlert', () => {
  let component: TfAlert;
  let fixture: ComponentFixture<TfAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TfAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TfAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
