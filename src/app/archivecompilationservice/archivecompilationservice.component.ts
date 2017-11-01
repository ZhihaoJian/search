import { Component, OnInit, HostBinding, Output, ViewChild, ElementRef } from '@angular/core';
import { slideInOutAnimation } from '../animation/animation';
import { CurrentFileServiceService } from '../service/currentFile/current-file-service.service';
import { TableService } from '../service/tableService/table.service';
declare var $: any;
declare var UE: any;

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

  // 辅助计数。
  // 因为子组件 @Input 的 setter 属性只有监听到输入值发生变化才执行事件，因此使用辅助计数欺瞒 @Input 的setter属性值检测
  count = 0;

  public errorMsg: object;
  public ue;  // Ueditor
  @ViewChild('title') title: ElementRef;
  @ViewChild('time') time: ElementRef;
  @ViewChild('container') container: ElementRef;
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute'

  constructor(private cfs: CurrentFileServiceService, private tbs: TableService, private el: ElementRef) { }

  ngOnInit() {
    // 初始化加载
    this.cfs.initLoading(
      '/terminal/archiveCompilationController/archiveCompilation',
      { 'shenheStatu': 'ALLOW' }
    ).then(res => {
      console.log(res);

      const chnames = ['', '编研名', '编研日期', '编研内容', '编研人', '审核人', '审核状态', '退回原因'];
      const ennames = ['', 'name', 'time', 'compContent', 'compUser', 'shenheUser', 'shenheStatu', 'returnRemark'];
      const customModel = this.tbs.getArchiveCompilationCustomModel(ennames);

      this.gridContentArray = {};
      this.gridContentArray['chnames'] = chnames;
      this.gridContentArray['ennames'] = ennames;
      this.gridContentArray['data'] = (res as any).obj.list;
      this.gridContentArray['config'] = {
        multiselect: false,
        colModel: customModel
      }
    });

    $('.ui.accordion')
      .accordion();

    this.initUeditor();
  }

  onGetPagerInfo(info: any) {
    this.pagerInfo = info;
  }

  /**
   * 查看编演服务弹窗
   */
  onCheckArchiveFile() {
    const checkedBox = $('#jqGrid > tbody tr.jqgrow > td > input');
    const hasCheckedBoxArray = this.tbs.getInputBoxChecked(checkedBox);

    this.errorMsg = {
      count: this.count++
    };

    if (hasCheckedBoxArray.length === 0) {
      (this.errorMsg as any).errorMsg = '请勾选内容！';
    } else if (hasCheckedBoxArray.length > 1) {
      (this.errorMsg as any).errorMsg = '只能选择一条目录查看！';
    } else {


      let archiveCompilationId, currentTaskId, processId;
      [archiveCompilationId, currentTaskId, processId] = this.tbs.getCustomCheckboxId(hasCheckedBoxArray[0]);


      this.reuestUeditorContent(archiveCompilationId);
      this.requestGridInModal(archiveCompilationId, processId);
    }
  }

  /**
   * 请求弹窗的表格
   * @param archiveCompilationId
   * @param processId
   */
  requestGridInModal(archiveCompilationId: string, processId: string) {

    const that = this;

    this.cfs.initLoading(
      '/terminal/archiveCompilationController/getAuditTaskById',
      {
        'appraisalId': archiveCompilationId,
        'processId': processId
      }
    ).then(
      res => {
        let tableName, dataIds, tableNameChs, tableNameEns;
        const response = (res as any).obj;

        [tableName, dataIds, tableNameChs, tableNameEns] = this.resolveResponseInModaloGrid(response);
        this.cfs.initLoading(
          '/terminal/archiveCompilationController/loadDataForTableHeader',
          {
            tableName: 'eddc_formal.' + tableName,
            tableHeaders: tableNameEns.toString(),
            id: dataIds,
            pagerNum: 1,
            pagerSize: 500
          }
        ).then(newRes => {

          $.jgrid.gridUnload('modal-jqGrid');

          this.cfs.createGrid(
            (newRes as any).obj.list,
            tableNameChs,
            tableNameEns,
            {
              gridID: 'modal-jqGrid',
              pager: 'modal-jqGrid-pager'
            }
          )
        })
          // tslint:disable-next-line:no-shadowed-variable
          .then(res => {
            $('#check-file-modal')
              .modal('show');

          }).catch(err => {
            console.log(err);
          })
      }).catch(err => {
        console.log(err);
      })
  }

  /**
   * 请求弹窗中ueditor的内容
   * @param archiveCompilationId
   */
  reuestUeditorContent(archiveCompilationId: string) {

    const that = this;

    this.cfs.initLoading(
      '/terminal/archiveCompilationController/findById',
      {
        'archiveCompilationId': archiveCompilationId
      }
    ).then(res => {

      const response = (res as any).obj;

      // 只保留一个Ueditor实例
      this.justifyUeditorNode();

      // 此处使用jQuery进行DOM操作，
      // 若使用Angular的ElementRef进行操作，在组件切换后会出现表单值插入不正确的情况
      $('#time').val(response.time);
      $('#title').val(response.name);
      // that.time.nativeElement.defaultValue = response.time;
      // that.title.nativeElement.defaultValue = response.name;

      // 延迟500ms后才对Ueditor插入内容,小于250ms则会初始渲染内容失败
      setTimeout(function () {
        that.ue.setContent(response.compContent);
      }, 500);


    }).catch(err => {
      console.log(err);
    })
  }

  /**
   * 处理弹窗表格的响应数据
   * @param res 请求响应
   */
  resolveResponseInModaloGrid(res: any) {
    return [res.tableName, res.dataIds, res.tableNameChs, res.tableNameEns];
  }


  /**
   * 初始化ueditor
   */
  initUeditor() {
    const config = {
      toolbars: [['print', 'fullscreen']],
      autoClearinitialContent: true,
      elementPathEnabled: false,
      initialFrameWidth: 910,
      initialFrameHeight: 360,
      readonly: false,
      autoSyncData: false
    };

    if (window.innerHeight <= 768) {
      config['initialFrameWidth'] = 850;
    }
    // this.ue = UE.getEditor(this.container.nativeElement.id, config);
    UE.delEditor(this.container.nativeElement.id);
    this.ue = new UE.ui.Editor(config);
    this.ue.render(this.container.nativeElement.id);
  }

  /**
   * 修正Ueditor在HTML中生成的多个Ueditor实例
   */
  justifyUeditorNode() {
    if ($('div.check-file-modal').length > 1) {

      const childNode = $('div.check-file-modal')[1];
      const parentNode = childNode.parentNode;

      parentNode.removeChild(childNode);

    }
  }
}
