import { Component, OnInit } from '@angular/core';
import { List } from '../types';
import {
  AngularFirestore,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

const PAGE_SIZE = 8;
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
        ref
          .limit(PAGE_SIZE)
          .where('isPrivate', '==', false)
          .orderBy(SORT_KEY, 'desc')
      )
      .snapshotChanges()
      .pipe(take(2)) // TODO this is some fucking joke angularFire + SSR broken af. Once this is fixed we can go back to use first
      // See here https://stackoverflow.com/questions/65388261/angular-11-firebase-server-side-rendering-infinite-loading-pending?newreg=29ad67b82729464eba43a3036d91c0fc
      // and see here https://github.com/angular/angularfire/issues/2420
      .subscribe((response) => {
        for (let item of response) {
          this.lists.push({
            ...item.payload.doc.data(),
            id: item.payload.doc.id,
          });
        }
        this._lastDoc = response[response.length - 1].payload.doc;
      });
  }

  ngOnInit(): void {}

  loadMore() {
    this.store
      .collection<List>('lists', (ref) =>
        ref
          .limit(PAGE_SIZE)
          .where('isPrivate', '==', false)
          .orderBy(SORT_KEY, 'desc')
          .startAfter(this._lastDoc)
      )
      .snapshotChanges()
      .pipe(take(2))
      .subscribe((response) => {
        if (!response.length) {
          this.listDone = true;
          return;
        }
        for (let item of response) {
          this.lists.push({
            ...item.payload.doc.data(),
            id: item.payload.doc.id,
          });
        }
        this._lastDoc = response[response.length - 1].payload.doc;
      });
  }
}
