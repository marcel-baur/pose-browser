import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosePlayerComponent } from './pose-player.component';

describe('PosePlayerComponent', () => {
  let component: PosePlayerComponent;
  let fixture: ComponentFixture<PosePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
