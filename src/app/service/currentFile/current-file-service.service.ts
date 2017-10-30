import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';


declare var $: any;

@Injectable()
export class CurrentFileServiceService {

  private IP = 'http://192.168.88.2:8080';

  constructor(private http: HttpClient) {
  }

  // 初始化加载，默认加载 开放档案服务的数据
  public initLoading(requestUrl: string, params: object) {
    const url = this.IP + requestUrl;
    let requestParams = new HttpParams();

    // 根据传入的参数构造动态请求参数列表
    for (const param in params) {
      if (params.hasOwnProperty(param)) {
        requestParams = requestParams.set(param.toString(), params[param]);
      }
    }


    // 查询开放档案的下拉框
    return new Promise((resolve, reject) => {
      this.http.post(url, null, {
        params: requestParams
      })
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
  public getFirstSelectionGrid(
    url: string,
    tableName: string,
    catalogueId: string,
    pageNum?: number,
    pageSize?: number,
    keyword?: string,
    dbName?: string) {

    this.enableLoading();
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
          this.getDataFromDb(tableName, url, catalogueId, tableNameArray, (res as any).en, pageNum, pageSize, keyword, dbName)
            .then(response => {
              console.log(response)
              resolve(response);
              this.disableLoading();
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
    pageSize?: number,
    keyword?: string,
    dataBaseName?: string) {

    const dbName = dataBaseName ? dataBaseName : 'eddc_open.';
    const requestUrl = this.IP + url;

    if (!pageNum) {
      pageNum = 1;
    }

    if (!pageSize) {
      pageSize = 10;
    }

    if (!keyword) {
      keyword = '';
    }

    return new Promise((resolve, reject) => {
      this.http.post(requestUrl, null, {
        params: new HttpParams()
          .set('tableName', dbName + tableName)
          .set('tableId', catalogueId)
          .set('tableHeaders', tableNameEns.toString())
          .set('pageNum', pageNum.toString())
          .set('pageSize', pageSize.toString())
          .set('keyWord', keyword)
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
    const requestUrl = this.IP + '/terminal/openArchivesController/getTableHeader';

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
   * 若config对象中有自定义的colModel，则覆盖默认的colModel
   *
   * 生成表格
   * @param data 元数据
   */
  public createGrid(data: object, chNames: Array<string>, enNames: Array<string>, config?: object) {

    if (data) {
      // const headers = this.generateTableHeaders(data);
      if (config && config.hasOwnProperty('colModel')) {
        this.generateGrid(data, [], chNames, config);
      } else {
        const colModel = this.generateColModel(enNames);
        this.generateGrid(data, colModel, chNames, config);
      }
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
   * @param header 中文表头
   * @param config 可选自定义配置项
   */
  private generateGrid(data: any, colModel: any, header: Array<string>, config?: object) {

    let gridID = '#jqGrid';
    let height = 650;

    if (config && config.hasOwnProperty('gridID')) {
      gridID = config['gridID'];

      if (gridID[0] !== '#') {
        gridID = '#' + gridID;
      }
    }

    if (window.innerHeight <= 768) {
      height = 450;
    }


    $(gridID).jqGrid({
      datatype: 'local',
      colModel: !!config && config.hasOwnProperty('colModel') ? config['colModel'] : colModel,
      localReader: {
        root: () => {
          return data.results || [];
        },
        id: () => {
          if (config && !config.hasOwnProperty('colModel') && config.hasOwnProperty('id')) {
            return config['id'];
          }
          return 'f_id';
        }
      },
      colNames: header,
      mtype: 'POST',
      pager: config && config['pager'] ? config['pager'] : '',
      multiselect: !!config && config.hasOwnProperty('multiselect') ? config['multiselect'] : true,
      // responsive: true,
      // rowNum: 20,
      // rowList: [10, 20, 30],
      scroll: true,
      height: !!config && config.hasOwnProperty('height') ? config['height'] : height,
      styleUI: 'jQueryUI',
      rowTotal: data.total,
      viewrecords: true,
      cellLayout: 15,
      // scrollPopUp: true,
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


  /**
   * 处理字符串，获取tableName和cataId
   * @param params 含有tableName和cataId字符串
   */
  public resolveParams(params: string) {
    const index = params.indexOf('&');
    const cataId = (params.substring(0, index)).substring('catalogueId='.length);
    const tableName = (params.substring(index + 1)).substring('tableName='.length);

    return [tableName, cataId];
  }

  public getParams(DOM_catalogue: string, pageSize: number, pageNum?: number) {
    // 获取下拉框的参数（含有当前门类的tableName和cataId）
    const selection = $(DOM_catalogue.toString())[0];
    // const selectedIndex = selection.selectedIndex;
    const params = selection.selectedOptions[0].id;

    let tableName, cataId;
    [tableName, cataId] = this.resolveParams(params);


    if (!pageNum) {
      pageNum = 1;
    }


    return [tableName, cataId, pageSize, pageNum];
  }

  /**
   * 更新表格（分页）
   * @param url 分页请求地址
   * @param tableName 当前表名
   * @param cataId 当前门类id
   * @param pageNum 第几页
   * @param pageSize 每页请求大小
   */
  public updateGrid(url: string, tableName: string, cataId: string, pageNum: any, pageSize: any, keyWord?: string, dataBaseName?: string) {

    let resultsLength, totalRecord, currentPage, totalPage;

    return new Promise((resolve, reject) => {
      this.getFirstSelectionGrid(
        url,
        tableName,
        cataId,
        pageNum,
        pageSize,
        keyWord).then(res => {
          $.jgrid.gridUnload('jqGrid');

          const data = (res as any).data.obj.list;
          const ch = (res as any).ch;
          const en = (res as any).en;

          // tslint:disable-next-line:triple-equals
          resultsLength = data.results == undefined ? 0 : data.results.length;
          totalRecord = data.totalRecord;
          currentPage = data.pageNum;
          totalPage = data.totalPage;

          resolve([resultsLength, totalRecord, currentPage, totalPage, data, ch, en]);

        })
    })
  }
}
