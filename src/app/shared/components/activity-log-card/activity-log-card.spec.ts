import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogCard } from './activity-log-card';

describe('ActivityLogCard', () => {
  let component: ActivityLogCard;
  let fixture: ComponentFixture<ActivityLogCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityLogCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
