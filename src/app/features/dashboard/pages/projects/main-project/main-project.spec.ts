import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainProject } from './main-project';

describe('MainProject', () => {
  let component: MainProject;
  let fixture: ComponentFixture<MainProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
