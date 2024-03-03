import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private http: HttpClient,
    private router: Router) {

  }

  ngOnInit(): void {
    //let user = this.authenticationService.userValue;
  }

    logout() {
      this.authenticationService.logout();
    }

    public authenticated() {
      return this.authenticationService.isAuthenticated();
    }

    get user() { return this.authenticationService.userValue; }

}
