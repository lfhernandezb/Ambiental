import { Component, HostListener } from '@angular/core';
import { User } from './interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { environment } from 'src/environments/environment';
import { SessionService } from './services/session.service';

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
      private route: ActivatedRoute,
      private authenticationService: AuthenticationService,
      private bnIdle: BnNgIdleService,
      private sessionService: SessionService
  ) {

  }

  // initiate it in your component OnInit
  ngOnInit(): void {

    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    this.authenticationService.user.subscribe(x => {
      // sesion aun activa
      this.user = x;

      // activamos session timeout
      this.bnIdle.startWatching(environment.sessionTimeout).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          //console.log('session expired');
          this.logout();
          this.bnIdle.stopTimer();
        }
      });
    });
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event: any) {
    console.log('window unload');
    //this.logout();
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event: any) {
    // ...
    this.sessionService.save();
  }

  @HostListener('window:load', [ '$event' ])
  loadHandler(event: any) {
    console.log('window load');
    this.sessionService.retrieve();
  }

  logout() {
      this.authenticationService.logout();
  }

}
