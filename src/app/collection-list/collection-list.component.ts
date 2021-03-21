import { Component, OnInit } from '@angular/core';
import { List } from '../types';
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';

const PAGE_SIZE = 3;
const SORT_KEY = 'updateDate';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css'],
})
export class CollectionListComponent implements OnInit {
  public lists: List[] = [];
  public listDone = false;
  private _lastDoc!: QueryDocumentSnapshot<List>; // save the last item in list so we can fetch more

  constructor(private store: AngularFirestore) {
    store
      .collection<List>('lists', (ref) =>
        ref.limit(PAGE_SIZE).orderBy(SORT_KEY)
      )
      .snapshotChanges()
      .subscribe((response) => {
        for (let item of response) {
          this.lists.push(item.payload.doc.data());
        }
        this._lastDoc = response[response.length - 1].payload.doc;
      });
    this.store = store;
  }

  ngOnInit(): void {}

  loadMore() {
    this.store
      .collection<List>('lists', (ref) =>
        ref.limit(PAGE_SIZE).orderBy(SORT_KEY).startAfter(this._lastDoc)
      )
      .snapshotChanges()
      .subscribe((response) => {
        if (!response.length) {
          this.listDone = true;
          return;
        }
        for (let item of response) {
          this.lists.push(item.payload.doc.data());
        }
        this._lastDoc = response[response.length - 1].payload.doc;
      });
  }
}
