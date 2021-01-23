import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemSearchService } from './shared/item-search.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Item} from '../types'
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css']
})
export class ItemSearchComponent implements OnInit {
  searchValue = new FormControl('gundam seed');

  searchResult: Observable<Item[]> | undefined;
  results: Item []; // This contains searchResult retrieved value.
  newCollection: Item[];

  constructor(private itemSearchService: ItemSearchService) {
    this.newCollection = [];
    this.results = [];
  }

  ngOnInit(): void {
    // this.searchValue.valueChanges.subscribe(console.log);
  }

  search() {
    console.log('searching:' + this.searchValue.value);
    this.searchResult = this.itemSearchService.getWikipedia(this.searchValue.value).pipe(tap(result => this.results = result));
    // this.items.subscribe(console.log);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.newCollection, event.previousIndex, event.currentIndex);
  }

  addToCollection(item: Item){

    this.newCollection.push(item)
    // reset search
    this.searchResult = undefined;
    this.searchValue.reset();
  }
}
