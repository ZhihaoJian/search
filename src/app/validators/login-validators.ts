import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms/src/model';

// 验证手机号
export function phoneNumberValidators(tel: FormControl): any {
    const regex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    const isPhone = regex.test(tel.value);
    return isPhone ? null : { 'isPhone': { value: tel.value } };
}

// 验证email
export function emailValidator(email: FormControl): any {
    // tslint:disable-next-line:max-line-length
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isPhone = regex.test(email.value);
    return isPhone ? null : { 'isEmail': { value: email.value } };
}

// 身份证验证
export function IdNumberValidator(idNumber: FormControl): any {

    // 15-18位身份证regex
    const basicRegex = /^\d{15}|(\d{17}(\d|x|X))$/;
    // 18位身份证regex
    const regex_18 = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/;
    // 15位身份证regex
    const regex_15 = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/;
    let isIDCard;

    if (basicRegex.test(idNumber.value)) {
        if (idNumber.value.length === 18) {
            isIDCard = regex_18.test(idNumber.value);
            return isIDCard ? null : { 'isIdCard': { value: idNumber.value } };
        }
        isIDCard = regex_15.test(idNumber.value);
        return isIDCard ? null : { 'isIdCard': { value: idNumber.value } };
    } else {
        return isIDCard ? null : { 'isIdCard': { value: idNumber.value } };
    }
}

// 户口本号码校验
export function accountBookValidator(accountBook: FormControl) {
    const regex = /^[a-zA-Z0-9]{3,21}$/;
    const isAccountBook = regex.test(accountBook.value);
    return isAccountBook ? null : { 'isAccountBook': { value: accountBook.value } };
}

// 验证护照
export function passPortValidator(passport: FormControl) {
    const regex = /(P\d{7})|(G\d{8})/;
    const isPassPort = regex.test(passport.value);
    return isPassPort ? null : { 'isPassPort': { value: passport.value } };
}
