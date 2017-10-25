import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  public options;

  @Input()
  set selection(selection: any) {
    if (selection) {
      // 填充下拉框
      this.options = selection;

      // 填充下拉框的默认值 catalogueId={{option.id}}&tableName={{option.other}}
      const newValue = `catalogueId=${this.options[0].id}&tableName=${this.options[0].other}`
      this.form.get('tableNameAndCataId').setValue(newValue);

      // 渲染下拉列表后填充默认值
      setTimeout(function () {
        this.catalogueSelection.options[0].selected = true;
      }, 500);
    }
  };

  @Output() pagerInfo = new EventEmitter();
  @ViewChild('catalogueSelection') catalogueSelection: ElementRef;



  constructor(public fb: FormBuilder, public ar: ActivatedRoute, public cfs: CurrentFileServiceService, public router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      tableNameAndCataId: [''],
      keyword: ['']
    })
  }

  ngAfterViewInit(): void {
    $('select.dropdown')
      .dropdown();
  }

  onSubmit(value: any) {
    console.log(value);

    let tableName, cataId;
    [tableName, cataId] = this.cfs.resolveParams(value.tableNameAndCataId);

    if (location.hash === '#/openFile') {

      this.cfs.updateGrid('/terminal/openArchivesController/loadDataForTableHeader',
        tableName, cataId,
        1,
        10,
        value.keyword)
        .then(res => {

          this.pagerInfo.emit(res);
        })


    } else if (location.hash === '#/currentFile') {
      this.cfs.updateGrid('/terminal/currentFileController/loadDataForTableHeader',
        tableName, cataId,
        1,
        10,
        value.keyword)
        .then(res => {
          this.pagerInfo.emit(res);
        })
    }
  }

  onChange(selection: any) {

    const params = selection.options[selection.options.selectedIndex].id;
    let tableName, cataId;
    [tableName, cataId] = this.cfs.resolveParams(params);

    let resultsLength, totalRecord, currentPage, totalPage, data, ch, en;

    this.cfs.updateGrid('/terminal/openArchivesController/loadDataForTableHeader', tableName, cataId, '1', '10')
      .then(res => {
        [resultsLength, totalRecord, currentPage, totalPage, data, ch, en] = (res as any);
        this.pagerInfo.emit([resultsLength, totalRecord, currentPage, totalPage]);
        this.cfs.createGrid(data, ch, en)
      })
  }

}
