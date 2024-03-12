pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        nodejs('NODEJS'){
          //here your npm commands p.e.
          sh 'npm install'
          sh 'npm install -g @angular/cli'
          sh 'ng build --base-href /ambiental-fe/ --configuration qa'
        }
      }
    }
    stage('deploy') {
      steps {
        sh 'sudo rm -rf /Users/lfhernandez/apache/apache/htdocs/ambiental-fe/'
        sh 'sudo cp -R dist/ambiental-fe /Users/apache/apache/htdocs/'
        sh 'sudo chown -R apache:staff /Users/apache/apache/htdocs/ambiental-fe/'
      }
    }

  }
}
