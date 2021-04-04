import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { response } from 'express';
import { Item } from '../../types';
import { Observable } from 'rxjs';
import { UrlInfo } from '../../types';
import { forkJoin } from 'rxjs';

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

  isValidHttpUrl(searchVal: string) {
    let url;
    try {
      url = new URL(searchVal);
    } catch (_) {
      return false;
    }
    return true;
  }

  getItems(val: string): Observable<Item[]> {
    if (this.isValidHttpUrl(val)) {
      return this.http
        .get(
          'https://us-central1-pictalist.cloudfunctions.net/scraper?url=' + val
        )
        .pipe(
          map((response: any) => {
            if (response.code === 'ENOTFOUND') {
              return [];
            }
            const urlInfo: UrlInfo = response;
            const card: Item = {
              id: 1,
              name: urlInfo.name,
              thumbnailImage: urlInfo.image || urlInfo.favicon || '',
              highResImage: urlInfo.image || urlInfo.favicon || '',
              description: urlInfo.description || '',
              url: urlInfo.url,
              source: 'link',
            };
            return [card];
          })
        );
    } else {
      return forkJoin(
        // as of RxJS 6.5+ we can use a dictionary of sources
        {
          google: this.getGoogle(val),
          wikipedia: this.getWikipedia(val),
        }
      ).pipe(
        map((result) => {
          return result.wikipedia.concat(result.google);
        })
      );
    }
  }

  getWikipedia(val: string): Observable<Item[]> {
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
        if (cards) {
          return cards.filter(
            (card: any) => card.thumbnailImage || card.highResImage
          );
        } else {
          return [];
        }
      })
    );
  }

  getGoogle(val: string): Observable<Item[]> {
    return this.http
      .get(
        'https://us-central1-pictalist.cloudfunctions.net/searcher?search=' +
          val
      )
      .pipe(
        map((response: any) => {
          const urlInfo: UrlInfo = response;
          // the following are all trial and error not sure if it'll always work
          // Here's an example response for searching final fantasy
          // ")]}'\n[[[\"final fantasy 7 remake\",46,[433,275],{\"zh\":\"Final Fantasy VII Remake\",\"zi\":\"Video game\",\"zp\":{\"gs_ssp\":\"eJzj4tbP1TcwNE4zL8koM2D0EkvLzEvMUUhLzCtJLK5UMFcoSs1NzE4FANYSDAE\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcSXDazKTiS47FGnAGPggjkU1vNKXhxE9FhfJRH_nD6eZXEHA5YPiSyMsgRvDw\\u0026s\\u003d10\"}],[\"final fantasy\",46,[433],{\"zh\":\"Final Fantasy\",\"zi\":\"Video game series\",\"zp\":{\"gs_ssp\":\"eJzj4tDP1TcwqiyvMGD04k3LzEvMUUhLzCtJLK4EAGMyCFA\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcTvnsXkuHwK-tZHkEwKbxR60VgHuv9xEd4UTUtyVjL4BiWbib4sL3ABZ9L2Eg\\u0026s\\u003d10\"}],[\"final fantasy 14\",46,[],{\"zh\":\"FINAL FANTASY XIV Online\",\"zi\":\"Online game\",\"zp\":{\"gs_ssp\":\"eJzj4tLP1TcwM8nJM7A0YPQSSMvMS8xRSEvMK0ksrlQwNAEAg2MI7Q\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcRty8AwIQj9cZNhFHxI2odID9oDp8nr6Y8dM61MZIA_XilzLdWjzxcaqpDUVQ\\u0026s\\u003d10\"}],[\"final fantasy 15\",46,[433,131],{\"zh\":\"FINAL FANTASY XV\",\"zi\":\"Video game\",\"zp\":{\"gs_ssp\":\"eJzj4tTP1TdIMbQsSDZg9BJIy8xLzFFIS8wrSSyuVDA0BQCAEQjh\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcQ1vbNympADZOMmg9P8WdenG4aKuG1uMWN3FsNB3dpDrLEe6bQJ5q03mkH23A\\u0026s\\u003d10\"}],[\"final fantasy movie\",46,[433,131],{\"zh\":\"Final Fantasy: The Spirits Within\",\"zi\":\"2001 film\",\"zp\":{\"gs_ssp\":\"eJzj4tDP1Tcwii8sMWD0Ek7LzEvMUUhLzCtJLK5UyM0vy0wFAJkmCnI\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcRc-dNe7DhOl3wLeVgStdeyNrP8DaiW5GqDRuHnGXHrRAe00lI2QOuLI_cKgQ\\u0026s\\u003d10\"}],[\"final fantasy 16\",46,[433],{\"zh\":\"Final Fantasy XVI\",\"zi\":\"Video game\",\"zp\":{\"gs_ssp\":\"eJzj4tVP1zc0zCg2sTDPMS0zYPQSSMvMS8xRSEvMK0ksrlQwNAMAo-AKBg\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcQhx8PH_AX-RwynBNDPGKcpUGxz3fTY-PmWOwRAX8QtTbdMqvw803UeZL7isQ\\u0026s\\u003d10\"}],[\"final fantasy kingsglaive\",46,[433,131],{\"zh\":\"Kingsglaive: Final Fantasy XV\",\"zi\":\"2016 film\",\"zp\":{\"gs_ssp\":\"eJzj4tVP1zc0TM4rtqwqKcoxYPSSTMvMS8xRSEvMK0ksrlTIzsxLL07PScwsSwUALYgO8A\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcQYx7xsLZT6WgGG1VTeywi_cYx0nBr5RjuOtDOUsI9hU6S6uM-hsi1w2fMXNQ\\u0026s\\u003d10\"}],[\"final fantasy 10\",46,[],{\"zh\":\"Final Fantasy X\",\"zi\":\"Video game\",\"zp\":{\"gs_ssp\":\"eJzj4tDP1TdIKTewMGD0EkjLzEvMUUhLzCtJLK5UMDQAAHZvCH0\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcSrf6d05_Lj8UVy7Sy96VLi-Y64k37iVnDWAHqJsQBm\\u0026s\\u003d10\"}],[\"final fantasy tactics\",46,[433],{\"zh\":\"Final Fantasy Tactics\",\"zi\":\"Video game\",\"zp\":{\"gs_ssp\":\"eJzj4tDP1TdIKSswN2D0Ek3LzEvMUUhLzCtJLK5UKElMLslMLgYAsQYLSg\"},\"zs\":\"https://encrypted-tbn0.gstatic.com/images?q\\u003dtbn:ANd9GcQYOsq2sWkTleiWARrEdfBcdh5nyP4ry8_EVcBxGbUV\\u0026s\\u003d10\"}],[\"final fantasy\\u003cb\\u003e 11\\u003c\\/b\\u003e\",0,[433]]],{\"q\":\"lJsKyGwOZ73BxDg9tSK1Zu1xPc0\"}]"

          const actualData = JSON.parse(response.split('\n')[1])[0];

          const cards: Item[] = [];

          actualData.forEach((data: any[], index: number) => {
            if (data.length != 4) {
              return;
            } else {
              const card: Item = {
                id: index,
                name: data[3].zh,
                thumbnailImage: data[3].zs || '',
                highResImage: data[3].zs || '',
                description: data[3].zi || '',
                url: 'https://www.google.ca/search?q=' + data[3].zh,
                source: 'google',
              };
              cards.push(card);
            }
          });

          return cards;
        })
      );
  }
}
