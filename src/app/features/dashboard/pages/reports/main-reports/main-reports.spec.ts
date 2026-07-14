import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainReports } from './main-reports';

describe('MainReports', () => {
  let component: MainReports;
  let fixture: ComponentFixture<MainReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
