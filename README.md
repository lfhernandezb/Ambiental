# AmbientalFe

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


echo "# Ambiental" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:lfhernandezb/Ambiental.git
git push -u origin main



cd ~/Development/angular/

ng new ambiental-fe

cd ambiental-fe

ng generate module layout
cd src/app/layout/
ng generate component layout
ng generate component header
ng generate component footer
cd ../../../
cd src/app/
ng generate component page-not-found

cd ../../../
ng generate module company
cd src/app/company/
ng generate component company

ng generate module company-routing

cd ../../../

cd src/app
mkdir services
cd services

ng generate service company
ng generate service project
ng generate service finding
ng generate service finding-state

ng generate service auth.guard
ng generate service authentication

cd ../../../

ng generate module project
cd src/app/project/
ng generate component project
ng generate module project-routing

cd ../../../
ng generate module finding
cd src/app/finding/
ng generate component finding
ng generate module finding-routing



cd ../../../
ng generate module alert
cd src/app/alert
ng generate component alert
ng generate service alert

# to use HttpClient

in app.module.ts

import {HttpClientModule} from '@angular/common/http';

in class that will use it:

import {HttpClient} from "@angular/common/http";

deploy

ng build --base-href /ambiental-fe/ --configuration qa
sudo rm -rf /Users/apache/apache/htdocs/ambiental-fe/
sudo cp -R dist/ambiental-fe /Users/apache/apache/htdocs/
sudo chown -R apache:staff /Users/apache/apache/htdocs/ambiental-fe/
