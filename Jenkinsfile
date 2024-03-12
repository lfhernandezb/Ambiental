pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash'
        sh 'export NVM_DIR="$HOME/.nvm"'
        sh '''

[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"'''
        sh 'nvm install 18'
        sh 'nvm use 18'
        sh 'npm install'
        sh 'npm install @angular/cli'
        sh 'ng build --base-href /ambiental-fe/ --configuration qa'
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