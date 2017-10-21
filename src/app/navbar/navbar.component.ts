import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  private linkIndex = '0';

  constructor() { }

  ngOnInit() {
    const href = location.pathname;
    if (href === '/openFile') {
      this.linkIndex = '0'
    } else if (href === '/currentFile') {
      this.linkIndex = '1'
    } else {
      this.linkIndex = '2'
    }
  }

  ngAfterViewInit() {
  }

  // 在线评价
  onShowRatingModal() {
    $('#ratingModal').modal('show');
    $('#rating').rating({
      initialRating: 5,
      maxRating: 5
    })
  }

  // 改变链接激活状态
  onChangeForcus(index: string) {
    this.linkIndex = index;
  }
}
