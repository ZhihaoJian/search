import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  phoneNumberValidators,
  emailValidator,
  IdNumberValidator,
  passPortValidator,
  accountBookValidator
} from 'app/validators/login-validators';
import { EventEmitter } from '@angular/core';
import { LoginService } from 'app/service/loginService/login-service.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
  providers: [LoginService]
})
export class LoginModalComponent implements OnInit {

  loginForm: FormGroup;

  nameOfIDCard = ['身份证', '户口本', '护照'];
  credentialsIdIndex: number;

  // 是否选择过证件
  isUnTouched = true;

  constructor(private fb: FormBuilder, private ls: LoginService, private router: Router) {
    this.initForm();
    this.loadLoginModal();
  }


  ngOnInit() {
  }

  // 初始化表单
  initForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      sex: '男',
      telephone: ['', phoneNumberValidators],
      email: ['', emailValidator],
      nameOfIDCard: '',
      numberOfIDCard: ['', Validators.required],
      company: '',
      purpose: '',
      ps: ''
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // 保存用户信息
      this.ls.request(
        '/terminal/currentFileController/checkIn',
        this.loginForm.value
      )
    }
  }

  /**
   * 第一次登入，强制用户录入信息
   */
  private loadLoginModal() {
    const _this = this;
    $('#login-modal').modal({
      closable: false,
      onApprove: function () {
        // 发送请求记录登录状态
        _this.router.navigate(['/openFile']);
        console.log('send!!');
      }
    })
      .modal('show');

  }

  /**
   * 根据不懂的证件选择不同的校验器
   * @param credentialsIdIndex 证件类型索引
   */
  onChangeSelection(credentialsIdIndex: any) {
    this.credentialsIdIndex = credentialsIdIndex;
    switch (Number.parseInt(credentialsIdIndex)) {
      case 0:
        // 身份证校验器填充
        this.loginForm.controls.numberOfIDCard.setValidators(IdNumberValidator);
        break;
      case 1:
        // 居住证校验器填充
        this.loginForm.controls.numberOfIDCard.setValidators(accountBookValidator);
        break;
      case 2:
        // 护照校验器填充
        this.loginForm.controls.numberOfIDCard.setValidators(passPortValidator);
        break;
    }
    this.isUnTouched = false;
  }
}
