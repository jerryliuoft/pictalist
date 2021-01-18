import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map, filter } from 'rxjs/operators';
import { response } from 'express';

const WIKIPEDIA = {
  // Documentation is here https://www.mediawiki.org/wiki/API:Search#API_documentation
  url: 'https://en.wikipedia.org/w/api.php',
  params: {
    action: 'query',
    format: 'json',
    prop: 'pageimages|extracts|info',
    exintro: '1',
    explaintext: '1',
    inprop: 'url',
    exsentences: '1',
    generator: 'search',
    redirects: '1',
    gsrsearch: 'Jerry', // actual search terms this need to be replaced
    gsrlimit: '5',
    gsrprop: 'snippet',
    pilicense: 'any',
    piprop: 'original|thumbnail',
    pithumbsize: '300',
    formatversion: '2',
    origin: '*',
  },
};

@Injectable({
  providedIn: 'root',
})
export class ItemSearchService {
  readonly URL = 'https://jsonplaceholder.typicode.com/todos';
  constructor(private http: HttpClient) {}

  getItems() {
    return this.http.get(this.URL);
  }

  getWikipedia(val: string) {
    // fromObject is not on angular doc but in the source code https://github.com/angular/angular/blob/master/packages/common/http/src/params.ts#L144
    const params = new HttpParams({ fromObject: WIKIPEDIA.params }).set(
      'gsrsearch',
      val
    );
    return this.http.get(WIKIPEDIA.url, { params }).pipe(
      // tap(console.log),
      map((response: any) => {
        const cards = response?.query?.pages.map((result: any) => ({
          id: result.pageid,
          name: result.title,
          thumbnailImage: result?.thumbnail?.source,
          highResImage: result?.original?.source,
          description: result.extract,
          url: result.fullurl,
          source: 'wikipedia',
        }));

        return cards.filter((card: any) => card.thumbnailImage || card.highResImage)
      })
    );
  }
}
