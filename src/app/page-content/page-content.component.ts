import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.css'],
})

// this is just a wrapper for all the pages so that I can apply some global styles
export class PageContentComponent implements OnInit {
  @Input() maxWidth: string = '50em';
  constructor() {}

  ngOnInit(): void {}
}
