import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementRowComponent } from './user-management-row.component';

describe('UserManagementRowComponent', () => {
  let component: UserManagementRowComponent;
  let fixture: ComponentFixture<UserManagementRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManagementRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
