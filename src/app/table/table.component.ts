import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';
import { TableService } from '../service/tableService/table.service';
declare var $: any;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [TableService]
})
export class TableComponent implements OnInit, AfterViewInit {

  private totalRecord = 0;
  private totalPage = 0;
  private resultsLength = 0;
  private gridArray = {};
  private currentStartIndex = 1;
  private previousPageSize = 10;
  @ViewChild('currentPage') currentPage: ElementRef;
  @ViewChild('pageSize') pageSize: ElementRef;

  @Input()
  set pagerInfo(pagerInfo: Array<number>) {
    if (pagerInfo) {
      console.log(pagerInfo);
      let data, chnames, ennames;
      [this.resultsLength, this.totalRecord, this.currentPage.nativeElement.value, this.totalPage, data, chnames, ennames] = pagerInfo;
      this.cfs.createGrid(data, chnames, ennames);
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
  constructor(private cfs: CurrentFileServiceService, private tbs: TableService) { }

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
      // 获取pageSize
      const pageSize = this.pageSize.nativeElement.selectedOptions[0].value
      this.getTableNameAndCataId(this.currentPage.nativeElement.value, pageSize);
    }
  }

  /**
   * 根据点击分页的不同，改变分页页码的大小
   * @param direction
   */
  private changePageIndex(direction): boolean {

    const canPost = true;
    const curPageNum = parseInt(this.currentPage.nativeElement.value, 10);

    return this.tbs.canChangeIndex(direction, curPageNum, this.totalPage, this.currentPage);
  }

  /**
   * 根据当前下拉框的选中项，获取tableName、cataId、pageSize然后请求分页
   */
  private getTableNameAndCataId(pageNum?: number, pageSize?: number) {

    let tableName, cataId;

    [tableName, cataId, pageSize, pageNum] = this.cfs.getParams('#catalogueSelection', pageSize, pageNum);

    this.cfs.updateGrid(
      '/terminal/openArchivesController/loadDataForTableHeader',
      tableName,
      cataId,
      pageNum,
      pageSize)
      .then(res => {
        let data, ch, en;
        [this.resultsLength, this.totalRecord, this.currentPage.nativeElement.value, this.totalPage, data, ch, en] = (res as any);

        // tslint:disable-next-line:max-line-length
        [this.currentStartIndex, this.resultsLength] = this.tbs.changePageIndex(data.pageNum, data.totalPage, data.results.length, data.totalRecord);

        this.cfs.createGrid(data, ch, en);
      })
  }

  /**
   * 根据分页显示条目数不同，更新请求pageSize和pageNum,更新表格
   * @param page
   */
  onChangePageSize(page) {
    // 改变的条目数
    const pageSize = parseInt(page.options[page.selectedIndex].value, 10);

    // 计算出来，最后应该所在的页号
    let resultNum = 1;

    // 当前所在页页号
    const currentPageNum = parseInt(this.currentPage.nativeElement.value, 10);

    if (currentPageNum === 1) {
      this.getTableNameAndCataId(1, pageSize);
      return;
    }

    if (pageSize > this.previousPageSize) {
      resultNum = Math.floor((currentPageNum * this.previousPageSize + 1) / pageSize) + 1;
    } else {
      resultNum = (currentPageNum * this.previousPageSize + 1) / pageSize - 1;
    }


    this.getTableNameAndCataId(resultNum, pageSize);

    // 更新条目数
    this.previousPageSize = pageSize;
  }


}
