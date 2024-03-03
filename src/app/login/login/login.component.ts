import { Component, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import { BnNgIdleService } from 'bn-ng-idle';
import { environment } from 'src/environments/environment';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: any;
  credentials = {username: '', password: ''};
  loading = false;
  submitted = false;
  returnUrl: any;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private bnIdle: BnNgIdleService ) {
  }

  login() {
    // console.log("LoginComponent::login() called");
    //this.credentials.username = this.username.value;
    //this.credentials.password = this.password.value;
    // console.log("login credentials: " + this.credentials);
    /*
    this.authenticationService.login(this.credentials.username, this.credentials.password) () => {
        this.router.navigateByUrl('/');
    });
    */
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log("login exitoso");
          // login exitoso
          this.router.navigate([this.returnUrl]);

          // seteamos idle timeout
          this.bnIdle.startWatching(environment.sessionTimeout)
          .subscribe((isTimedOut: boolean) => {
            if (isTimedOut) {
              // console.log('session expired');
              this.authenticationService.logout();
              this.bnIdle.stopTimer();
            }
          });

        },
        error: error => {
          console.log("login no exitoso: error: " + error.toString());
          this.error = error;
          this.loading = false;
        }
      });
  }
  /*
  error() {
    //console.log(this.appService);
  	return this.authenticationService.error;
  }
  */
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ])


    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


  }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    get username() { return this.loginForm.get('username'); }

    get password() { return this.loginForm.get('password'); }

}
