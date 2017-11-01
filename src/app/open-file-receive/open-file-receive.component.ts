import { Component, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';
import { slideInOutAnimation } from '../animation/animation';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';

@Component({
  selector: 'app-open-file-receive',
  templateUrl: './open-file-receive.component.html',
  styleUrls: ['./open-file-receive.component.css'],
  animations: [slideInOutAnimation]

})
export class OpenFileReceiveComponent implements OnInit {

  @Output() selection: any;
  @Output() gridContentArray;

  // 辅助计数。
  // 因为子组件 @Input 的 setter 属性只有监听到输入值发生变化才执行事件，因此使用辅助计数欺瞒 @Input 的setter属性值检测
  count = 0;

  errorMsg: object;
  pagerInfo;
  chnames: Array<string>;
  ennames: Array<string>;
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute'

  constructor(private cfs: CurrentFileServiceService) { }

  ngOnInit() {
    this.getSelectionValue();
  }

  // 首次加载从服务器获取 开放档案服务的数据，期间用遮罩显示‘加载中...’，加载完毕去除遮罩
  private getSelectionValue() {
    this.cfs.initLoading(
      '/terminal/openArchivesController/getCatalogueTree',
      {
        'classifyType': 'FILINGFILE,FILECOMPILING,VOLUMES,ARCHIVES'
      })
      .then(res => {
        this.sperateData(res);
        return res;
      }).then(data => {

        const tableName = (data as any).obj[0].other;
        const id = (data as any).obj[0].id;

        this.getFirstGridContent(tableName, id);
      })
  }

  // 根据表名和门类id 请求下拉框第一个选项的表格内容
  private getFirstGridContent(tableName: string, id: string) {

    this.cfs
      .getFirstSelectionGrid('/terminal/openArchivesController/loadDataForTableHeader', tableName, id)
      .then(res => {
        console.log(res);
        this.gridContentArray = {};
        this.gridContentArray['chnames'] = (res as any).ch;
        this.gridContentArray['ennames'] = (res as any).en;
        this.gridContentArray['data'] = (res as any).data.obj.list;
      })
  }

  onGetPagerInfo(info: any) {
    console.log(info);
    this.pagerInfo = info;
  }


  /**
   * 数组结构
   * @param data 元数据
   */
  private sperateData(data: any) {
    this.selection = data.obj;
  }

  private onGetErrorMsg(errorMsg: string) {
    console.log(errorMsg);
    this.errorMsg = { errorMsg: errorMsg, count: this.count++ };
  }
}
