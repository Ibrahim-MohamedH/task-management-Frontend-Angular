import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainActivityLogs } from './main-activity-logs';

describe('MainActivityLogs', () => {
  let component: MainActivityLogs;
  let fixture: ComponentFixture<MainActivityLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainActivityLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainActivityLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
