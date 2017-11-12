import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  public linkIndex = '0';

  constructor(private router: Router) { }

  ngOnInit() {

    const hash = location.hash;
    if (hash === '#/openFile') {
      this.linkIndex = '0'
    } else if (hash === '#/currentFile') {
      this.linkIndex = '1'
    } else if (hash === '#/archivecompilationservice') {
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
