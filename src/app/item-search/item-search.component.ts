import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent implements OnInit {
  searchValue= new FormControl('some value');

  constructor() { 
  }

  ngOnInit(): void {
    this.searchValue.valueChanges.subscribe(console.log)
  }

}
