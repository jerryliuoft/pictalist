import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, first, tap } from 'rxjs/operators';
import { isRegExp } from 'util';

import { User } from '../types';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | undefined>;
  user: User | undefined;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(undefined);
        }
      }),
      tap((user: User | undefined) => {
        if (user) {
          this.user = user;
        }
      })
    );
  }

  getCurrentUser() {
    return this.user;
  }
}
