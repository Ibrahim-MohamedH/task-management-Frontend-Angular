import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActivityLogs } from './list-activity-logs';

describe('ListActivityLogs', () => {
  let component: ListActivityLogs;
  let fixture: ComponentFixture<ListActivityLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListActivityLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListActivityLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
