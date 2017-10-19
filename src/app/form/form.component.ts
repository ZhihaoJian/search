import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  @Input() selection: any;



  constructor(public fb: FormBuilder, public ar: ActivatedRoute, public cfs: CurrentFileServiceService) { }

  ngOnInit() {
    this.form = this.fb.group({
      table: [''],
      input: ['']
    })
  }

  ngAfterViewInit(): void {
    $('select.dropdown')
      .dropdown();
  }

  onSubmit(value: any) {
    if (location.pathname === '/openFile') {

    } else if (location.pathname === '/currentFile') {

    } else {

    }
  }


}
