import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenFileReceiveComponent } from './open-file-receive.component';

describe('OpenFileReceiveComponent', () => {
  let component: OpenFileReceiveComponent;
  let fixture: ComponentFixture<OpenFileReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenFileReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenFileReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
