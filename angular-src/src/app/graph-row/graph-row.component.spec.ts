import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphRowComponent } from './graph-row.component';

describe('GraphRowComponent', () => {
  let component: GraphRowComponent;
  let fixture: ComponentFixture<GraphRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
