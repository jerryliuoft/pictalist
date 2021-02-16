import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemSearchComponent } from './item-search/item-search.component';
import { CoreModule } from './core/core.module';
import { LoginComponent } from './login/login.component';
import { ListDetailComponent } from './list-detail/list-detail.component';
import { CollectionListComponent } from './collection-list/collection-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemSearchComponent,
    LoginComponent,
    ListDetailComponent,
    CollectionListComponent,
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
