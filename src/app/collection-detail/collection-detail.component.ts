import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { List } from '../types';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css'],
})
export class CollectionDetailComponent implements OnInit {
  // public list$: Observable<List | undefined>;
  public list: List | undefined;

  constructor(
    private route: ActivatedRoute,
    private store: AngularFirestore,
    public user: AuthService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.store
            .doc<List>('lists/' + params.get('id'))
            .valueChanges({ idField: 'id' })
        ),
        take(1)
      )
      .subscribe((data) => {
        this.list = data;
        const title = 'Pictalist: ' + this.list?.title;
        this.title.setTitle(title);
        this.meta.addTags([
          { name: 'twitter:card', content: 'summary' },
          { name: 'og:url', content: 'https://pictalist/list/' + data?.id },
          { name: 'og:title', content: title },
          // { name: 'og:description', content: 'no Description' },
          {
            name: 'og:image',
            content: this.list?.collection[0].thumbnailImage || '',
          },
        ]);
      });
  }
}
