import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TableService } from 'app/service/tableService/table.service';
declare var $: any;

import { IP } from '../share/share';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [TableService]
})
export class FormComponent implements OnInit, AfterViewInit {

  @Output() errorMsg = new EventEmitter();
  form: FormGroup;
  options;
  @Input() dianziwenjianEn; // 电子文件字段值
  @Input() tableName; // 表名
  EDCBtnShow = true; // 是否查看电子文件

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



  constructor(
    public fb: FormBuilder,
    public ar: ActivatedRoute,
    public cfs: CurrentFileServiceService,
    public router: Router,
    private tbs: TableService) { }

  ngOnInit() {
    this.form = this.fb.group({
      tableNameAndCataId: [''],
      keyword: ['']
    });

    const hash = window.location.hash;
    if (hash === '#/currentFile') {
      this.EDCBtnShow = true;
    } else {
      this.EDCBtnShow = false;
    }
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
    const classifyName = selection.options[selection.options['selectedIndex']].innerText; // 门类名称
    let tableName, cataId;
    [tableName, cataId] = this.cfs.resolveParams(params);

    let resultsLength, totalRecord, currentPage, totalPage, data, ch, en;

    this.cfs.updateGrid('/terminal/openArchivesController/loadDataForTableHeader', tableName, cataId, '1', '10')
      .then(res => {
        [resultsLength, totalRecord, currentPage, totalPage, data, ch, en] = (res as any);

        if (ch.length === 0 && en.length === 0) {
          this.errorMsg.emit(`该门类 [ ${classifyName} ] 结构未正确设置，请联系管理员`);
        }

        this.pagerInfo.emit([resultsLength, totalRecord, currentPage, totalPage]);
        this.cfs.createGrid(data, ch, en)
      })
  }

  // 查看电子文件
  onCheckEDCFile() {
    const checkedBox = $('#jqGrid > tbody tr.jqgrow > td > input');
    const hasCheckedBoxArray = this.tbs.getInputBoxChecked(checkedBox);


    if (hasCheckedBoxArray.length === 0) {
      alert('请勾选内容！');
    } else if (hasCheckedBoxArray.length > 1) {
      alert('只能选择一条目录查看！');
    } else {
      const inputId = hasCheckedBoxArray[0].id.substring(11);
      const id = ($('#jqGrid').getRowData(inputId))[this.dianziwenjianEn];

      window.open(`${IP}/static/plugins/filereader/filereader.html?tableName=${this.tableName}&filenames=${id}&index=0`);
    }
  }
}
