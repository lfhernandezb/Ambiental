node {

     stage("Git Clone"){

        git credentialsId: 'GIT_HUB_CREDENTIALS',
            url: 'https://github.com/lfhernandezb/Ambiental.git',
            branch: 'authtoken'
    }
    /*
    stage('Build') {

       sh 'npm run build --configuration=qa'

    }
    */
    stage("Docker build"){
        sh 'docker version'
        sh 'docker build -t ambiental-fe .'
        sh 'docker image list'
        sh 'docker tag ambiental-fe lfhernandezb/ambiental-fe:latest'
    }

    withCredentials([string(credentialsId: 'DOCKER_HUB_PASSWORD', variable: 'PASSWORD')]) {
        sh 'docker login -u lfhernandezb -p $PASSWORD'
    }

    stage("Push Image to Docker Hub"){
        sh 'docker push  lfhernandezb/ambiental-fe:latest'
    }

    stage("SSH Into k8s Server") {
        def remote = [:]
        remote.name = 'K8S master'
        remote.host = '192.168.1.170'
        remote.user = 'lfhernandez'
        remote.password = 'bl52b3rd'
        remote.allowAnyHosts = true

        stage('Put pod.yml onto k8smaster') {
            sshPut remote: remote, from: 'pod.yml', into: '.'
        }

        stage('Deploy ambiental-fe') {
          sshCommand remote: remote, command: "source ./.zshrc ; microk8s kubectl apply -f pod.yml"
        }

        stage('Put servive.yml onto k8smaster') {
            sshPut remote: remote, from: 'service.yml', into: '.'
        }

        stage('Service ambiental-fe') {
          sshCommand remote: remote, command: "source ./.zshrc ; microk8s kubectl apply -f service.yml"
        }
    }

}
