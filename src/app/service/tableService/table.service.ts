import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class TableService {

  constructor() { }


  /**
   * 分页
   * @param pageNum 当前页码
   * @param totalPage 总页数
   * @param dataLength 回传数据长度
   * @param totalRecord 总记录条数
   */
  public changePageIndex(pageNum: number, totalPage: number, dataLength: number, totalRecord: number) {
    if (pageNum === 1) {
      return [1, dataLength];
    } else if (pageNum > 1 && pageNum !== totalPage) {
      const end = pageNum * dataLength;
      const start = end - dataLength + 1;
      return [start, end];
    } else if (pageNum !== 1 && pageNum === totalPage) {
      const start = totalRecord - dataLength + 1;
      return [start, totalRecord];
    }
  }

  /**
   * 根据点击分页的不同，改变分页页码的大小
   * @param direction 点击方向
   * @param curPageNum 当前页码
   * @param totalPage 总页数
   * @param currentPageDOM 当前页码DOM结点
   */
  public canChangeIndex(direction: string, curPageNum: number, totalPage: number, currentPageDOM: ElementRef): boolean {

    const canPost = true;

    if (direction === 'first-page' && curPageNum > 1) {
      currentPageDOM.nativeElement.value = 1;
    } else if (direction === 'next-page') {
      if (curPageNum + 1 > totalPage) {
        return !canPost;
      }
      currentPageDOM.nativeElement.value = curPageNum + 1;
    } else if (direction === 'last-page') {
      if (totalPage && curPageNum !== totalPage) {
        currentPageDOM.nativeElement.value = totalPage;
      } else {
        return !canPost;
      }
    } else {
      if (curPageNum - 1 <= 0) {
        return !canPost;
      }
      currentPageDOM.nativeElement.value = curPageNum - 1;
    }

    return canPost;
  }

  /**
   * 返回勾选的 checkedbox数组
   * @param checkBoxArray 当前页面所有checkbox
   */
  public getInputBoxChecked(checkBoxArray: Array<HTMLInputElement>): Array<HTMLInputElement> {
    const boxChecked = [];
    for (let i = 0; i < checkBoxArray.length; i++) {
      if (checkBoxArray[i].checked) {
        boxChecked.push(checkBoxArray[i]);
      }
    }
    return boxChecked;
  }

  /**
   * 档案编研 自定义model
   * @param ennames 英文表头
   */
  public getArchiveCompilationCustomModel(ennames: Array<string>) {
    const model = [];

    ennames.forEach((element) => {
      if (element === '') {
        model.push({
          width: 33,
          align: 'center',
          formatter: (cellvalue, options, rowObject) => {
            const archiveCompilationId = rowObject.archiveCompilationId;
            const currentTaskId = rowObject.currentTaskId;
            const processId = rowObject.processId;

            return `<input type="checkbox" id="${archiveCompilationId + ',' + currentTaskId + ',' + processId}" >`;
          }
        })
      } else if (element === 'compContent') {
        model.push({
          name: element,
          index: element,
          align: 'center',
          formatter: function (cellvalue, options, rowObj) {
            return cellvalue.replace(/<\/?[^>]+>/gi, '');
          }
        })
      } else if (element === 'shenheStatu') {
        model.push({
          name: element,
          align: 'center',
          index: element,
          formatter: function (cellvalue, options, roObj) {
            switch (cellvalue) {
              case 'ALLOW': return '允许调阅';
              case 'NEVERAUDIT': return '未审核';
              case 'REJECT': return '驳回';
              case 'INAUDIT': return '审核中';
              case 'NOTALLOW': return '不允许调阅';
              case 'AGREE': return '同意';
            }
          }
        })
      } else {
        model.push({
          name: element,
          index: element,
          align: 'center',
          sortable: true
        })
      }
    });

    return model;
  }

  /**
   * 获取自定义checkbox的id
   * @param checkbox 自定义checkbox
   */
  getCustomCheckboxId(checkbox: HTMLInputElement) {
    return checkbox.id.split(',');
  }

}
