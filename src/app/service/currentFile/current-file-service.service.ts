import { Injectable } from '@angular/core';
import { AUTH } from './mockData';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';


declare var $: any;

@Injectable()
export class CurrentFileServiceService {

  private auth: AUTH;
  private IP = 'http://192.168.88.2:8080';

  constructor(private http: HttpClient) {
  }

  // 初始化加载，默认加载 开放档案服务的数据
  public initLoading(requestUrl: string) {
    const url = this.IP + requestUrl;

    // 查询开放档案的下拉框
    return new Promise((resolve, reject) => {
      this.http.post(url, null)
        .subscribe(metaData => {

          console.log(metaData);
          this.disableLoading();

          resolve(metaData);

        }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
          }
        })
    });
  }

  /**
   * 得到下拉框所选择的表格内容
   * @param url 请求地址
   * @param tableName 表名（英文）
   * @param catalogueId 请求ID
   */
  public getFirstSelectionGrid(url: string, tableName: string, catalogueId: string, pageNum?: number, pageSize?: number) {


    const tableNameArray = {};

    return new Promise((resolve, reject) => {
      this.getTableHeader(tableName)
        .then(res => {
          if (res) {
            tableNameArray['ch'] = (res.obj.tableNameChs);
            tableNameArray['en'] = (res.obj.tableNameEns);
          }
          return tableNameArray;
        })
        .then(res => {
          this.getDataFromDb(tableName, url, catalogueId, tableNameArray, (res as any).en, pageNum, pageSize)
            .then(response => {
              console.log(response)
              resolve(response);
            })
        })
        .catch(err => {
          console.log(err);
        })
    })
  }

  // 从数据库获取数据
  private getDataFromDb(
    tableName: string,
    url: string,
    catalogueId: string,
    tableNameArray: object,
    tableNameEns: Array<string>,
    pageNum?: number,
    pageSize?: number) {

    const dbName = 'eddc_open.';
    const requestUrl = this.IP + url;

    if (!pageNum) {
      pageNum = 1;
    }

    if (!pageSize) {
      pageSize = 10;
    }

    return new Promise((resolve, reject) => {
      this.http.post(requestUrl, null, {
        params: new HttpParams()
          .set('tableName', dbName + tableName)
          .set('tableId', catalogueId)
          .set('tableHeaders', tableNameEns.toString())
          .set('pageNum', pageNum.toString())
          .set('pageSize', pageSize.toString())
      })
        .subscribe(data => {
          tableNameArray['data'] = data;
          resolve(tableNameArray);
        })
    })
  }


  /**
   * 获取表头
   * @param tableName 表头名
   */
  private getTableHeader(tableName: string): Promise<any> {
    const requestUrl = this.IP + '/app/appController/getTableHeader';

    return new Promise((resolve, reject) => {
      this.http.post(requestUrl, null, {
        params: new HttpParams()
          .set('tableName', tableName)
      }).subscribe(metaData => {
        resolve(metaData);
      }, err => {
        console.log(err);
      })
    })
  }



  /**
   * 获取id列表
   * @param metaData 元数据
   */
  public getSpecialData(metaData: any) {
    const ids = [];
    const tableName = [];
    const tableNameCH = [];

    metaData.data.forEach(element => {
      ids.push(element.id);
      tableName.push(element.tableName);
      tableNameCH.push(element.tableNameCH);
    });

    return [ids, tableName, tableNameCH];
  }


  /**
   * 生成表格
   * @param data 元数据
   */
  public createGrid(data: object, chNames: Array<string>, enNames: Array<string>) {

    if (data) {
      // const headers = this.generateTableHeaders(data);
      const colModel = this.generateColModel(enNames);
      this.generateGrid(data, colModel, chNames);
    }
  }


  /**
   * 生成列配置项数组
   * @param data 服务器数据
   */
  private generateColModel(metaData: any) {

    const colModel = [];

    metaData.forEach(element => {
      colModel.push({
        name: element,
        index: element,
        align: 'center'
      })
    });

    return colModel;
  }

  /**
   * 生成表头
   * @param metaData 元数据
   */
  private generateTableHeaders(metaData: any) {
    const headers = [];

    metaData.forEach(element => {
      headers.push(element.tableNameCH);
    });

    return headers;

  }


  /**
   * 本地构造表格
   * 生成grid
   * @param data 服务器回传数据
   * @param colModal 列配置
   */
  private generateGrid(data: any, colModel: any, header: Array<string>) {
    $('#jqGrid').jqGrid({
      datatype: 'local',
      data: data.results,
      colModel: colModel,
      colNames: header,
      // pager: 'pager',
      mtype: 'POST',
      multiselect: true,
      responsive: true,
      rowNum: 20,
      rowList: [10, 20, 30],
      scroll: true,
      height: 550,
      styleUI: 'jQueryUI',
      rowTotal: data.total,
      viewrecords: true,
      cellLayout: 15,
      scrollPopUp: true,
      pgbuttons: true,
      prmNames: {
        page: 'pageNum',
        rows: 'pageSize',
        sort: 'sidx',
        order: 'sord'
      },
      loadComplete: function () {
        (document.getElementsByClassName('ui-jqgrid-bdiv')[0] as any).style.width = '100%';
      }
    })
      .navGrid('#pager', {
        edit: false,
        add: false,
        del: false,
        search: false,
        view: false,
        nav: true,
        refresh: true
      })
  }

  // 启用遮罩
  private enableLoading() {
    const loading = document.getElementById('segment');
    loading.style.display = 'block';
    $('html,body').css('overflow-y', 'hidden')
  }

  // 禁用遮罩
  private disableLoading() {
    const loading = document.getElementById('segment');
    loading.style.display = 'none';
    $('html,body').css('overflow-y', 'auto')
  }
}
