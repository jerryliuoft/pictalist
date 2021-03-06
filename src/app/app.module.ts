import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemSearchComponent } from './item-search/item-search.component';
import { CoreModule } from './core/core.module';
import { LoginComponent } from './login/login.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionListProfileComponent } from './collection-list-profile/collection-list-profile.component';
import { CollectionDetailComponent } from './collection-detail/collection-detail.component';
import { PageContentComponent } from './page-content/page-content.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemSearchComponent,
    LoginComponent,
    CollectionListComponent,
    CollectionListProfileComponent,
    CollectionDetailComponent,
    PageContentComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
