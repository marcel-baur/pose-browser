import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseVisualizerComponent } from './pose-visualizer.component';

describe('PoseVisualizerComponent', () => {
  let component: PoseVisualizerComponent;
  let fixture: ComponentFixture<PoseVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoseVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoseVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
