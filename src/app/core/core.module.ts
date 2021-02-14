import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseModule } from './firebase.module';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

@NgModule({
  declarations: [],
  imports: [CommonModule, FirebaseModule],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxAuthFirebaseUIModule,
  ],
})
export class CoreModule {}
