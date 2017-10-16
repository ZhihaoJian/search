import { Component, OnInit, HostBinding } from '@angular/core';
import { slideInOutAnimation } from '../animation/animation';

@Component({
  selector: 'app-open-file-receive',
  templateUrl: './open-file-receive.component.html',
  styleUrls: ['./open-file-receive.component.css'],
  animations: [slideInOutAnimation]

})
export class OpenFileReceiveComponent implements OnInit {

  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute'

  constructor() { }

  ngOnInit() {
  }

}
