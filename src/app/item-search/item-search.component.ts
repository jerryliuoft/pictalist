import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ItemSearchService } from './shared/item-search.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Item, List } from '../types';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.css'],
})
export class ItemSearchComponent implements OnInit {
  searchValue = new FormControl('');
  collectionTitle = new FormControl('', Validators.required);

  searchResult: Observable<Item[]> | undefined;
  results: Item[]; // This contains searchResult retrieved value.
  newCollection: Item[];
  list$: Observable<List | undefined>;
  list: List | undefined;
  private listDoc: AngularFirestoreDocument<List> | undefined;

  constructor(
    private itemSearchService: ItemSearchService,
    private store: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.newCollection = [];
    this.results = [];

    // Populate all data if this is editing an existing list
    this.list$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.listDoc = store.doc<List>('list/' + params.get('id'));
        return this.listDoc.valueChanges({ idField: 'id' });
      }),
      tap((list) => {
        if (list && list.id !== 'null') {
          // id always gets populated because of idField from above
          console.log('TEST TEST');
          console.log(list);
          this.list = list;
          this.newCollection = list.collection;
          this.collectionTitle = new FormControl(
            list.title,
            Validators.required
          );
        }
      })
    );
  }

  ngOnInit(): void {}

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

  // this will upload to firebase
  saveCollection() {
    if (this.listDoc && this.list) {
      this.listDoc.update({
        title: this.collectionTitle.value,
        collection: this.newCollection,
        updateDate: new Date(),
      });
      this.router.navigate(['/list', this.list.id]);
    } else {
      const newList: List = {
        title: this.collectionTitle.value,
        users: [{ id: '1', name: 'tmp', profilePicture: '' }],
        collection: this.newCollection,
        creationDate: new Date(),
        updateDate: new Date(),
        visibility: '',
      };
      this.store
        .collection('list')
        .add(newList)
        .then((docRef) => {
          this.router.navigate(['/list', docRef.id]);
        });
    }
    this.newCollection = [];
  }
}
