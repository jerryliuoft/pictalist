import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebaseConfig),
  ],
  declarations: [],
})
export class FirebaseModule {}
