import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorManagementEditModalComponent } from './sensor-management-edit-modal.component';

describe('SensorManagementEditModalComponent', () => {
  let component: SensorManagementEditModalComponent;
  let fixture: ComponentFixture<SensorManagementEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorManagementEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorManagementEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
