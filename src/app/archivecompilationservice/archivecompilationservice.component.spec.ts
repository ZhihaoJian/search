import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivecompilationserviceComponent } from './archivecompilationservice.component';

describe('ArchivecompilationserviceComponent', () => {
  let component: ArchivecompilationserviceComponent;
  let fixture: ComponentFixture<ArchivecompilationserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivecompilationserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivecompilationserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
