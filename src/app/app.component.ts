import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { slider } from './route-animations';
import { AuthService } from './services/auth.service';
import { LinkMenuItem } from 'ngx-auth-firebaseui';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slider],
})
export class AppComponent {
  links: LinkMenuItem[] = [];

  constructor(public auth: AuthService, private router: Router) {
    this.links = [
      { icon: 'favorite', text: 'My lists', callback: this.goToProfile },
    ];
  }

  goToProfile = () => {
    this.router.navigate(['/user/' + this.auth.getCurrentUser()?.uid]);
  };

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }
}
