import { Component, OnInit, AfterViewInit, HostBinding } from '@angular/core';
import { slideInOutAnimation } from '../animation/animation';
declare var $: any;

@Component({
  selector: 'app-current-file',
  templateUrl: './current-file.component.html',
  styleUrls: ['./current-file.component.css'],
  animations: [slideInOutAnimation]

})
export class CurrentFileComponent implements OnInit, AfterViewInit {

  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute'

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  search() {
    // 第一次加载默认关闭折叠面板
    $('#advancedSearch').accordion('close', 0);
    $('#searchModal').modal('show');
    // 现行文件服务  搜索按钮 高级检索
    $('#advancedSearchBtn').on('click', function (e) {
      e.stopPropagation();
      $('#advancedSearch').accordion('toggle', 0);
    });
  }

  export() {
    $('#export').modal('show');
  }

  print() {
    $('#printEFile').modal('show');
  }

}
