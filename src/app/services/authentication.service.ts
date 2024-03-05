import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ObservedValueOf, Subscribable, Subscription, of } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  httpOptions: any;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User | null>;
  // store the URL so we can redirect after logging in
  public redirectUrl: string | null = null;

  // initialises the userSubject with the user object from localStorage
  // which enables the user to stay logged in between page refreshes or
  // after the browser is closed
  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')!));
      this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
      return this.userSubject.value;
  }

  public isAuthenticated() {
    /*
      const user = this.userValue;
      //console.log("isAuthenticated user: " + user);
      //console.log("isAuthenticated user && user.authdata: " + user && user.authdata);
      //return user && user.authdata;
      return user != null;
      //return false;
      */

      return JSON.parse(localStorage.getItem('user')!) != null;
  }

  login(username: string, password: string) {
      //var user: User;
      // console.log('AuthenticationService::login() called');
      // console.log('credentials: ' + username + ' ' + password);
      this.httpOptions = {
          headers: new HttpHeaders({
            'authorization': 'Basic ' + window.btoa((username + ':' + password)),
            'Content-Type':  'application/json',
            'Content-Security-Policy': 'default-src ' + `${environment.apiUrl}/;`
          }),
          observe: 'body' as const
      };

      return this.http.get<any>(`${environment.apiUrl}/api/login`, this.httpOptions)
      .pipe(map(
        (user: any) => {
              console.log("login data: " + user);
              //if (user.name) {
                //let user: User = {} as User;
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                //user.name = user['name'];
                localStorage.setItem('user', JSON.stringify(user));
                //  The user object is then published to all subscribers
                this.userSubject.next(user);
                return user;
              //}
              //return null;

        }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('user');
      //  publishes null to all subscribers
      this.userSubject.next({} as any);
      this.router.navigate(['/login']);
  }
}
