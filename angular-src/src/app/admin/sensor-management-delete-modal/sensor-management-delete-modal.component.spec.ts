import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorManagementDeleteModalComponent } from './sensor-management-delete-modal.component';

describe('SensorManagementDeleteModalComponent', () => {
  let component: SensorManagementDeleteModalComponent;
  let fixture: ComponentFixture<SensorManagementDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorManagementDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorManagementDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
