import { Component, OnInit, AfterViewInit, HostBinding } from '@angular/core';
import { slideInOutAnimation } from '../animation/animation';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';

declare var $: any;

@Component({
  selector: 'app-current-file',
  templateUrl: './current-file.component.html',
  styleUrls: ['./current-file.component.css'],
  animations: [slideInOutAnimation]
})
export class CurrentFileComponent implements OnInit, AfterViewInit {

  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute'

  constructor(private cfs: CurrentFileServiceService) { }


  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }


}
