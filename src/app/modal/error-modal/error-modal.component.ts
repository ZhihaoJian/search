import { Component, OnInit, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {

  errorObj: object;
  error: string;

  @Input() set errorMsg(errorObj: object) {
    if (errorObj) {
      this.error = (errorObj as any).errorMsg;
      $('#error-modal').modal('show');
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
