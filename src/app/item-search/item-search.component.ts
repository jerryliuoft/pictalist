import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemSearchService } from './shared/item-search.service';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
})
export class ItemSearchComponent implements OnInit {
  searchValue = new FormControl('gundam seed');

  items: any;

  constructor(private itemSearchService: ItemSearchService) {}

  ngOnInit(): void {
    // this.searchValue.valueChanges.subscribe(console.log);
  }

  search() {
    console.log('searching:' + this.searchValue.value);
    this.items = this.itemSearchService.getWikipedia(this.searchValue.value);
    // this.items.subscribe(console.log);
  }
}
