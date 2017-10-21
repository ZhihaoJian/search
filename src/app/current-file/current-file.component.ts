import { Component, OnInit, AfterViewInit, HostBinding, Output } from '@angular/core';
import { slideInOutAnimation } from '../animation/animation';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';

declare var $: any;

@Component({
  selector: 'app-current-file',
  templateUrl: './current-file.component.html',
  styleUrls: ['./current-file.component.css'],
  animations: [slideInOutAnimation]
})
export class CurrentFileComponent implements OnInit, AfterViewInit {

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
    this.cfs.initLoading(
      '/terminal/currentFileController/getCurrentCatalogueTree',
      {
        'classifyType': 'ACTIVEFILE'
      }
    ).then(res => {
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
      .getFirstSelectionGrid('/terminal/currentFileController/loadDataForTableHeader', tableName, id)
      .then(res => {
        console.log(res);
        this.gridContentArray = {};
        this.gridContentArray['chnames'] = (res as any).ch;
        this.gridContentArray['ennames'] = (res as any).en;
        this.gridContentArray['data'] = (res as any).data.obj.list;
      })
  }

  ngAfterViewInit(): void {
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


}
