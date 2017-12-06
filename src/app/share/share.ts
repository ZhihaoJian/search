import { HttpParams } from '@angular/common/http';

export const IP = 'http://192.168.103.107:9090';

export function generateRequestParam(params: object) {

    let requestParams = new HttpParams();

    // 根据传入的参数构造动态请求参数列表
    for (const param in params) {
        if (params.hasOwnProperty(param)) {
            requestParams = requestParams.set(param.toString(), params[param]);
        }
    }

    return requestParams;
}
