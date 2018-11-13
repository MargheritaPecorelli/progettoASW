import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorManagementListComponent } from './sensor-management-list.component';

describe('SensorManagementListComponent', () => {
  let component: SensorManagementListComponent;
  let fixture: ComponentFixture<SensorManagementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorManagementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorManagementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
