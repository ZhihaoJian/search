import { Component, OnInit } from '@angular/core';
import { CurrentFileServiceService } from './service/currentFile/current-file-service.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.getDataFromServer();
  }

  constructor(private service: CurrentFileServiceService) { }

  // 首次加载从服务器获取 开放档案服务资源，期间用遮罩显示‘加载中...’，加载完毕去除遮罩
  getDataFromServer() {
    this.service.initLoading();
  }
}
