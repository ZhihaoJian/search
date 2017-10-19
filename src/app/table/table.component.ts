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

    const selection = $('#catalogueSelection')[0];
    const selectedIndex = selection.selectedIndex;
    const params = selection.selectedOptions[selectedIndex].id;

    if (direction === 'first-page') {
      this.currentPage.nativeElement.value = 1;
    } else if (direction === 'next-page') {
      this.currentPage.nativeElement.value = parseInt(this.currentPage.nativeElement.value, 10) + 1;
    } else if (direction === 'last-page') {
      this.currentPage.nativeElement.value = this.totalPage;
    } else {
      this.currentPage.nativeElement.value = parseInt(this.currentPage.nativeElement.value, 10) - 1;
    }
  }

}
