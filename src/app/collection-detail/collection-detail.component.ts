import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { List } from '../types';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css'],
})
export class CollectionDetailComponent implements OnInit {
  public list$: Observable<List | undefined>;

  constructor(private route: ActivatedRoute, private store: AngularFirestore) {
    this.list$ = this.route.paramMap.pipe(
      tap(console.log),
      switchMap((params: ParamMap) =>
        store.doc<List>('list/' + params.get('id')).valueChanges()
      ),
      tap(console.log)
    );
  }

  ngOnInit(): void {
    // this.items = [1, 2, 3, 4, 5, 6, 7, 8];
  }
}
