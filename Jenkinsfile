pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        nodejs('NODEJS_18') {
          sh 'npm install'
          sh 'npm install -g @angular/cli'
          sh 'ng build --base-href /ambiental-fe/ --configuration qa'
        }

      }
    }

    stage('deploy') {
      agent any
      steps {
        sh 'ssh apache@192.168.1.155 "rm -rf apache/apache/htdocs/ambiental-fe"'
        sh 'scp -R dist/ambiental-fe apache@192.168.1.155:apache/htdocs/'
      }
    }

  }
}