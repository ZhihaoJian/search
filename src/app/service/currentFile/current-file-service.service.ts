import { Injectable } from '@angular/core';
import { AUTH } from './mockData';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Injectable()
export class CurrentFileServiceService {

  private auth: AUTH;
  IP = 'http://localhost:7070';

  constructor(private http: HttpClient) {
  }

  checkUser(name: string, pwd: string) {
    console.log(name, pwd);
    const auth = new AUTH(name, pwd);
    auth.checkUser();
    if (auth.isAuth()) {
      $('#printEEfile_sec_modal').modal('show');
    } else {
      $('#errorMsg').removeClass('hidden');
      $('#errorMsg').addClass('visiable');
    }
  }

  // 初始化加载
  initLoading() {
    const url = this.IP + '/app/appController/getCatalogueTree';
    this.http.post(url, null)
      .subscribe(data => {
        console.log(data);
        this.disableLoading();
      })
  }

  // 启用遮罩
  enableLoading() {
    const loading = document.getElementById('segment');
    loading.style.display = 'block';
    $('html,body').css('overflow-y', 'hidden')
  }

  // 禁用遮罩
  disableLoading() {
    const loading = document.getElementById('segment');
    loading.style.display = 'none';
    $('html,body').css('overflow-y', 'auto')
  }
}

export const tableArray = ['归档文件目录', '归档文件目录', '归档文件目录', '归档文件目录', '归档文件目录'];
