import { Component, OnInit, HostBinding, Output } from '@angular/core';
import { slideInOutAnimation } from '../animation/animation';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';
import { TableService } from '../service/tableService/table.service';
declare var $: any;

@Component({
  selector: 'app-archivecompilationservice',
  templateUrl: './archivecompilationservice.component.html',
  styleUrls: ['./archivecompilationservice.component.css'],
  animations: [slideInOutAnimation],
  providers: [TableService]
})
export class ArchivecompilationserviceComponent implements OnInit {

  @Output() gridContentArray;
  pagerInfo;
  chnames: Array<string>;
  ennames: Array<string>;
  public errorMsg;
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute'

  constructor(private cfs: CurrentFileServiceService, private tbs: TableService) { }

  ngOnInit() {
    this.cfs.initLoading(
      '/terminal/archiveCompilationController/archiveCompilation',
      { 'shenheStatu': 'ALLOW' }
    ).then(res => {
      console.log(res);

      const chnames = ['编研名', '编研日期', '编研内容', '编研人', '审核人', '审核状态', '退回原因'];
      const ennames = ['name', 'time', 'compContent', 'compUser', 'shenheUser', 'shenheStatu', 'returnRemark'];

      this.gridContentArray = {};
      this.gridContentArray['chnames'] = chnames;
      this.gridContentArray['ennames'] = ennames;
      this.gridContentArray['data'] = (res as any).obj.list;
      this.gridContentArray['config'] = { id: 'archiveCompilationId' }
    });

    $('.ui.accordion')
      .accordion({
        selector: {
          trigger: '.title .icon'
        }
      });
  }

  onGetPagerInfo(info: any) {
    console.log(info);
    this.pagerInfo = info;
  }

  onCheckArchiveFile() {
    const checkedBox = $('#jqGrid > tbody tr.jqgrow > td > input');
    const hasCheckedBoxArray = this.tbs.getInputBoxChecked(checkedBox);
    if (hasCheckedBoxArray.length === 0) {
      this.errorMsg = '请勾选内容！';
      $('#error-modal').modal('show');
    } else if (hasCheckedBoxArray.length > 1) {
      this.errorMsg = '只能选择一条目录查看！';
      $('#error-modal').modal('show');
    } else {
      $('#check-file-modal').modal('show');
    }
  }
}
