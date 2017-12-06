import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { IP, generateRequestParam } from '../../share/share';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  request(url: string, data: object, config?: object) {

    const requestUrl = IP + url;

    const requestParams = generateRequestParam(data);

    this.http.post(
      requestUrl,
      null,
      {
        params: requestParams
      })
      .subscribe(metaData => {
        console.log(metaData);
      })
  }

}
