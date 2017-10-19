import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';
declare var $: any;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {

  private totleRecord = 0;
  private totalPage = 0;
  private resultsLength = 0;
  @ViewChild('currentPage') currentPage: ElementRef;
  @ViewChild('pageSize') pageSize: ElementRef;

  @Input()
  set gridContentArray(gca: Array<object>) {
    console.log(gca);
    if (gca) {
      this.resultsLength = (gca as any).data.results.length;
      this.totleRecord = (gca as any).data.totalRecord;
      this.totalPage = (gca as any).data.totalPage;
      this.cfs.createGrid((gca as any).data, (gca as any).chnames, (gca as any).ennames);
    }
  }
  constructor(private cfs: CurrentFileServiceService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  /**
   * 点击分页面板切换页面
   * @param direction 方向
   */
  onChangePage(direction) {

    // 改变分页面板分页值
    if (direction === 'first-page') {
      this.currentPage.nativeElement.value = 1;
    } else if (direction === 'next-page') {
      if (parseInt(this.currentPage.nativeElement.value, 10) + 1 > this.totalPage) {
        return;
      }
      this.currentPage.nativeElement.value = parseInt(this.currentPage.nativeElement.value, 10) + 1;

    } else if (direction === 'last-page') {
      this.currentPage.nativeElement.value = this.totalPage;
    } else {
      if (this.currentPage.nativeElement.value - 1 <= 0) {
        return;
      }
      this.currentPage.nativeElement.value = parseInt(this.currentPage.nativeElement.value, 10) - 1;
    }

    // 获取下拉框的参数（含有当前门类的tableName和cataId）
    const selection = $('#catalogueSelection')[0];
    const selectedIndex = selection.selectedIndex;
    const params = selection.selectedOptions[selectedIndex].id;

    const index = params.indexOf('&');
    const tableName = params.substring(0, index);
    const cataId = params.substring(index + 1);

    // 获取pageSize
    const pageSize = this.pageSize.nativeElement.selectedOptions[this.pageSize.nativeElement.options['selectedIndex']].value

    this.cfs.getFirstSelectionGrid(
      '/app/appController/loadDataForTableHeader',
      tableName,
      cataId,
      this.currentPage.nativeElement.value,
      pageSize);
  }

}
