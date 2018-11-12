import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementEditModalComponent } from './user-management-edit-modal.component';

describe('UserManagementEditModalComponent', () => {
  let component: UserManagementEditModalComponent;
  let fixture: ComponentFixture<UserManagementEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManagementEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
