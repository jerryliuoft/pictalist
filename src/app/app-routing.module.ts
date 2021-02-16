import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemSearchComponent } from './item-search/item-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  { path: '', redirectTo: '/list', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'list', component: ItemListComponent, data: { animation: 'isLeft' } },
  {
    path: 'new',
    component: ItemSearchComponent,
    data: { animation: 'isRight' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule, BrowserAnimationsModule],
})
export class AppRoutingModule {}
