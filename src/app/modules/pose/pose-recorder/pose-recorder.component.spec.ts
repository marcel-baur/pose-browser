import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseRecorderComponent } from './pose-recorder.component';

describe('PoseRecorderComponent', () => {
  let component: PoseRecorderComponent;
  let fixture: ComponentFixture<PoseRecorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoseRecorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoseRecorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
