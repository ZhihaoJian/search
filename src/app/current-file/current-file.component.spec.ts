import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFileComponent } from './current-file.component';

describe('CurrentFileComponent', () => {
  let component: CurrentFileComponent;
  let fixture: ComponentFixture<CurrentFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
