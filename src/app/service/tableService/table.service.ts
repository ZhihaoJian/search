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
  changePageIndex(pageNum: number, totalPage: number, dataLength: number, totalRecord: number) {
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
  canChangeIndex(direction: string, curPageNum: number, totalPage: number, currentPageDOM: ElementRef): boolean {

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
}
