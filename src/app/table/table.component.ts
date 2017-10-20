import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';
declare var $: any;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {

  private totalRecord = 0;
  private totalPage = 0;
  private resultsLength = 0;
  private gridArray = {};
  @ViewChild('currentPage') currentPage: ElementRef;
  @ViewChild('pageSize') pageSize: ElementRef;

  @Input()
  set pagerInfo(pagerInfo: Array<number>) {
    if (pagerInfo) {
      console.log(pagerInfo);
      [this.resultsLength, this.totalRecord, this.currentPage.nativeElement.value, this.totalPage] = pagerInfo;
    }
  }


  @Input()
  set gridContentArray(gca: Array<object>) {
    console.log(gca);
    if (gca) {
      this.readyCreateGrid(gca);
      this.cfs.createGrid((gca as any).data, (gca as any).chnames, (gca as any).ennames);
    }
  }
  constructor(private cfs: CurrentFileServiceService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  /**
   * 创建表格前对分页数据进行处理
   * @param gca
   */
  private readyCreateGrid(gca: any) {
    try {
      this.resultsLength = (gca as any).data.results.length;
    } catch (error) {
      this.resultsLength = 0;
    }
    try {
      this.totalRecord = (gca as any).data.totalRecord;
    } catch (error) {
      this.totalRecord = 0;
    }
    try {
      this.totalPage = (gca as any).data.totalPage;
    } catch (error) {
      this.totalPage = 0;
    }
  }


  /**
   * 点击分页面板切换页面
   * @param direction 方向
   */
  private onChangePage(direction) {
    const canPost = this.changePageIndex(direction);
    if (canPost) {
      this.getTableNameAndCataId();
    }
  }

  /**
   * 根据点击分页的不同，改变分页页码的大小
   * @param direction
   */
  private changePageIndex(direction): boolean {

    const canPost = true;
    const curPageNum = parseInt(this.currentPage.nativeElement.value, 10);

    if (direction === 'first-page' && curPageNum > 1) {
      this.currentPage.nativeElement.value = 1;
    } else if (direction === 'next-page') {
      if (curPageNum + 1 > this.totalPage) {
        return !canPost;
      }
      this.currentPage.nativeElement.value = curPageNum + 1;
    } else if (direction === 'last-page') {
      if (this.totalPage && curPageNum !== this.totalPage) {
        this.currentPage.nativeElement.value = this.totalPage;
      } else {
        return !canPost;
      }
    } else {
      if (curPageNum - 1 <= 0) {
        return !canPost;
      }
      this.currentPage.nativeElement.value = curPageNum - 1;
    }

    return canPost;
  }

  /**
   * 根据当前下拉框的选中项，获取tableName、cataId、pageSize然后请求分页
   */
  private getTableNameAndCataId() {
    // 获取下拉框的参数（含有当前门类的tableName和cataId）
    const selection = $('#catalogueSelection')[0];
    // const selectedIndex = selection.selectedIndex;
    const params = selection.selectedOptions[0].id;

    let tableName, cataId;
    [tableName, cataId] = this.cfs.resolveParams(params);

    // 获取pageSize
    const pageSize = this.pageSize.nativeElement.selectedOptions[this.pageSize.nativeElement.options['selectedIndex']].value

    this.cfs.updateGrid('/terminal/openArchivesController/loadDataForTableHeader', tableName, cataId, this.currentPage.nativeElement.value, pageSize)
      .then(res => {
        let data, ch, en;
        [this.resultsLength, this.totalRecord, this.currentPage.nativeElement.value, this.totalPage, data, ch, en] = (res as any);
        this.cfs.createGrid(data, ch, en)
      })
  }

}
