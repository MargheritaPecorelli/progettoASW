import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorManagementRowComponent } from './sensor-management-row.component';

describe('SensorManagementRowComponent', () => {
  let component: SensorManagementRowComponent;
  let fixture: ComponentFixture<SensorManagementRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorManagementRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorManagementRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
