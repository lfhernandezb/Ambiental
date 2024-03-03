import { Component, HostListener } from '@angular/core';
import { User } from './interfaces/user';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ambiental-fe';
  user: any;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      private bnIdle: BnNgIdleService
  ) {

  }

  // initiate it in your component OnInit
  ngOnInit(): void {

    this.authenticationService.user.subscribe(x => {
      // sesion aun activa
      this.user = x;

      // activamos session timeout
      this.bnIdle.startWatching(environment.sessionTimeout).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          console.log('session expired');
          this.logout();
          this.bnIdle.stopTimer();
        }
      });
    });
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event: any) {
    this.logout();
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event: any) {
    // ...
  }

  logout() {
      this.authenticationService.logout();
  }

}
