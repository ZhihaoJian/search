import { Injectable } from '@angular/core';
import { AUTH } from './mockData';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Injectable()
export class CurrentFileServiceService {

  private auth: AUTH;
  IP = 'http://192.168.88.89:8080';

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

  initLoading() {
    const url = this.IP + '/app/appController/getCatalogueTree';
    this.http.post(url, null)
      .subscribe(data => {
        console.log(data);
        const loading = document.getElementById('segment');
        loading.style.display = 'none';

        $('html,body').css('overflow-y', 'auto')
      })
  }
}

export const tableArray = ['归档文件目录', '归档文件目录', '归档文件目录', '归档文件目录', '归档文件目录'];
