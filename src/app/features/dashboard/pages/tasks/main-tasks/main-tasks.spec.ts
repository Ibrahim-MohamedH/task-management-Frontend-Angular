import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTasks } from './main-tasks';

describe('MainTasks', () => {
  let component: MainTasks;
  let fixture: ComponentFixture<MainTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
