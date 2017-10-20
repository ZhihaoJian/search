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
    this.cfs.initLoading('/terminal/openArchivesController/getCatalogueTree')
      .then(res => {
        this.sperateData(res);
        return res;
      }).then(data => {

        const tableName = (data as any).obj[0].other;
        const id = (data as any).obj[0].id;

        this.getFirstGridContent(tableName, id);
      })
  }

  // 请求下拉框第一个选项的表格内容
  private getFirstGridContent(tableName: string, id: string) {

    this.cfs
      .getFirstSelectionGrid('/app/appController/loadDataForTableHeader', tableName, id)
      .then(res => {
        console.log(res);
        this.gridContentArray = {};
        this.gridContentArray['chnames'] = (res as any).ch;
        this.gridContentArray['ennames'] = (res as any).en;
        this.gridContentArray['data'] = (res as any).data.obj.list;
      })
  }

  onGetPagerInfo(info: any) {
    this.pagerInfo = info;
  }


  /**
   * 数组结构
   * @param data 元数据
   */
  private sperateData(data: any) {
    this.selection = data.obj;
  }
}
