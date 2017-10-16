import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tableArray } from '../service/currentFile/current-file-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  form: FormGroup;
  tableArray = tableArray;

  constructor(public fb: FormBuilder, public ar: ActivatedRoute) { }

  ngOnInit() {
    this.form = this.fb.group({
      table: [''],
      input: ['']
    })
  }

  onSubmit(value: any) {
    if (location.pathname === '/openFile') {

    } else if (location.pathname === '/currentFile') {

    } else {

    }
  }


}
