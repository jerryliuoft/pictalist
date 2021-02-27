import { Component, OnInit } from '@angular/core';
import { List } from '../types';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css'],
})
export class CollectionListComponent implements OnInit {
  public lists$: Observable<List[]>;

  constructor(private store: AngularFirestore) {
    this.lists$ = store
      .collection<List>('list')
      .valueChanges({ idField: 'id' });
    this.store = store;
  }

  ngOnInit(): void {}
}
