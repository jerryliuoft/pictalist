import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ItemSearchService } from './shared/item-search.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Item, List, User } from '../types';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Collection extends Item {
  selected: FormControl;
}
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
  newCollection: Collection[];
  list$: Observable<List | undefined>;
  list: List | undefined;
  private listDoc: AngularFirestoreDocument<List> | undefined;
  searching$: BehaviorSubject<any>; // used to diaply the loading bar

  constructor(
    private itemSearchService: ItemSearchService,
    private store: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    private user: AuthService
  ) {
    this.searching$ = new BehaviorSubject(false);
    this.newCollection = [];
    this.results = [];
    // Populate all data if this is editing an existing list
    this.list$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.listDoc = store.doc<List>('lists/' + params.get('id'));
        return this.listDoc.valueChanges({ idField: 'id' });
      }),
      tap((list) => {
        if (list && list.id !== 'null') {
          // id always gets populated because of idField from above
          this.list = list;
          this.newCollection = list.collection.map(
            this.convertItemToCollection
          );
          this.collectionTitle = new FormControl(
            list.title,
            Validators.required
          );
        }
      })
    );
  }

  ngOnInit(): void {
    this.searchValue.valueChanges.subscribe((val) => {
      // Clear existing result if there are any because user has changed the input
      // TODO: maybe don't use the result anymore and just have searchResult
      // because result is just for the feature where I can add without using mouse
      this.searchResult = undefined;
      this.results = [];
    });
  }

  search() {
    // If search already has result then append the first item
    // TODO might want it to be selectable on pc using arrows
    if (this.results.length > 0) {
      this.addToCollection(this.results[0]);
    } else {
      this.searching$.next(true);
      this.searchResult = this.itemSearchService
        .getItems(this.searchValue.value)
        .pipe(
          tap((result) => {
            this.results = result;
            this.searching$.next(false);
          })
        );
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
    this.newCollection.unshift(this.convertItemToCollection(item));
    // reset search
    this.searchResult = undefined;
    this.searchValue.reset();
    this.results = [];
  }

  removeFromCollection() {
    this.newCollection = this.newCollection.filter(
      (cur) => !cur.selected.value
    );
  }

  private convertItemToCollection(item: Item) {
    return { ...item, selected: new FormControl(false) };
  }

  private convertCollectionToItem(collection: Collection) {
    const { selected, ...item } = collection;
    return item;
  }

  hasSelection(): boolean {
    return !!this.newCollection.find((col) => col.selected.value);
  }

  // this will upload to firebase
  async saveCollection() {
    // need to remove the meta data from the collections
    const collection = this.newCollection.map((col) =>
      this.convertCollectionToItem(col)
    );

    if (this.listDoc && this.list) {
      this.listDoc.update({
        title: this.collectionTitle.value,
        collection,
        updateDate: new Date(),
      });
      this.router.navigate(['/list', this.list.id]);
    } else {
      const newList: List = {
        title: this.collectionTitle.value,
        users: [],
        collection,
        creationDate: new Date(),
        updateDate: new Date(),
        visibility: '',
      };
      // add the current user
      const currentUser: User | undefined = await this.user.getCurrentUser();
      if (currentUser) {
        newList.users = [currentUser];
      }

      this.store
        .collection('lists')
        .add(newList)
        .then((docRef) => {
          this.router.navigate(['/list', docRef.id]);
        });
    }
    this.newCollection = [];
  }
}
