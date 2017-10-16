import { Component, OnInit, HostBinding } from '@angular/core';
import { slideInOutAnimation } from '../animation/animation';

@Component({
  selector: 'app-archivecompilationservice',
  templateUrl: './archivecompilationservice.component.html',
  styleUrls: ['./archivecompilationservice.component.css'],
  animations: [slideInOutAnimation]
})
export class ArchivecompilationserviceComponent implements OnInit {

  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute'

  constructor() { }

  ngOnInit() {
  }

}
