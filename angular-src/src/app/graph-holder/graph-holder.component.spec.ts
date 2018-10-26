import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphHolderComponent } from './graph-holder.component';

describe('GraphHolderComponent', () => {
  let component: GraphHolderComponent;
  let fixture: ComponentFixture<GraphHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
