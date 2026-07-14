import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainUsers } from './main-users';

describe('MainUsers', () => {
  let component: MainUsers;
  let fixture: ComponentFixture<MainUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
