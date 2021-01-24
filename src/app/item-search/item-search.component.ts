import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemSearchService } from './shared/item-search.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Item } from '../types';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css'],
})
export class ItemSearchComponent implements OnInit {
  searchValue = new FormControl('gundam seed');

  searchResult: Observable<Item[]> | undefined;
  results: Item[]; // This contains searchResult retrieved value.
  newCollection: Item[];

  constructor(private itemSearchService: ItemSearchService) {
    this.newCollection = [];
    this.results = [];
    this.newCollection = [
      {
        name: 'test',
        id: 1,
        thumbnailImage: 'https://picsum.photos/200',
        highResImage: 'https://picsum.photos/200',
        description: 'SOME DESCRIPTION',
        url: 'https://picsum.photos/200',
        source: 'test',
      },
      {
        name: 'test 2',
        id: 1,
        thumbnailImage: 'https://picsum.photos/200',
        highResImage: 'https://picsum.photos/200',
        description: 'SOME DESCRIPTION',
        url: 'https://picsum.photos/200',
        source: 'test',
      },
    ];
  }

  ngOnInit(): void {
    // this.searchValue.valueChanges.subscribe(console.log);
  }

  search() {
    // If search already has result then append the first item
    // TODO might want it to be selectable on pc using arrows
    if (this.results.length > 0) {
      this.addToCollection(this.results[0]);
    } else {
      this.searchResult = this.itemSearchService
        .getWikipedia(this.searchValue.value)
        .pipe(tap((result) => (this.results = result)));
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.newCollection,
      event.previousIndex,
      event.currentIndex
    );
  }

  addToCollection(item: Item) {
    this.newCollection.push(item);
    // reset search
    this.searchResult = undefined;
    this.searchValue.reset();
    this.results = [];
  }

  removeFromCollection(item: Item) {
    this.newCollection = this.newCollection.filter((cur) => cur !== item);
  }

  saveCollection() {
    this.newCollection = [];
  }
}
