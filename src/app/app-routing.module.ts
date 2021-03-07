import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ItemSearchComponent } from './item-search/item-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionDetailComponent } from './collection-detail/collection-detail.component';
import { AuthGuard } from './services/auth.guard';

// Animation use isLeft for swiping to left and right for the other way
const routes: Routes = [
  { path: '', redirectTo: '/browse', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'browse',
    component: CollectionListComponent,
    data: { animation: 'isLeft' },
  },
  {
    path: 'list/:id',
    component: CollectionDetailComponent,
    data: { animation: 'isRight' },
  },
  {
    path: 'edit/:id',
    component: ItemSearchComponent,
  },
  {
    path: 'new',
    component: ItemSearchComponent,
    data: { animation: 'isRight' },
    canActivate: [AuthGuard],
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
