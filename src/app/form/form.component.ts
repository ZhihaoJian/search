import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() pagerInfo = new EventEmitter();



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

  onChange(selection: any) {

    const params = selection.options[selection.options.selectedIndex].id;
    let tableName, cataId;
    [tableName, cataId] = this.cfs.resolveParams(params);

    let resultsLength, totalRecord, currentPage, totalPage, data, ch, en;

    this.cfs.updateGrid('/app/appController/loadDataForTableHeader', tableName, cataId, '1', '10')
      .then(res => {
        [resultsLength, totalRecord, currentPage, totalPage, data, ch, en] = (res as any);
        this.pagerInfo.emit([resultsLength, totalRecord, currentPage, totalPage]);
        this.cfs.createGrid(data, ch, en)
      })
  }

}
