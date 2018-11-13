import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementDeleteModalComponent } from './user-management-delete-modal.component';

describe('UserManagementDeleteModalComponent', () => {
  let component: UserManagementDeleteModalComponent;
  let fixture: ComponentFixture<UserManagementDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManagementDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
