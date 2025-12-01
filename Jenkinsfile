pipeline {
  agent any

  tools { nodejs 'NodeJS_18' }

  environment {
    EMAIL_TO = credentials('JENKINS_EMAIL_TO')
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
    GITHUB_CREDENTIALS = 'github-creds'
    DOCKER_IMAGE = 'h7djtv/nextjs-math-api'
  }

  options {
    ansiColor('xterm')
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install dependencies') {
      steps {
        echo 'Instalando dependencias con npm ci'
        script { isUnix() ? sh('npm ci') : bat('npm ci') }
      }
    }

    stage('Lint & Style') {
      steps {
        echo 'Ejecutando ESLint...'
        script { isUnix() ? sh('npm run lint') : bat('npm run lint') }
        echo 'Verificando formato con Prettier...'
        script {
          bat(script: 'npm run format:check', returnStatus: true)
        }
      }
    }

    stage('Type Check') {
      steps {
        echo 'Chequeo de tipos con TypeScript...'
        script { isUnix() ? sh('npm run typecheck') : bat('npm run typecheck') }
      }
    }

    stage('Check Path Alias') {
      steps {
        bat 'echo Checking tsconfig path aliases...'
        bat 'type tsconfig.json'
      }
    }

    stage('Unit Tests') {
      steps {
        echo 'Ejecutando pruebas unitarias con Vitest...'
        script { isUnix() ? sh('npm test') : bat('npm test') }
      }
    }

    // --------- NUEVO: Build & Push Docker image ---------
    stage('Build & Push Docker Image') {
      when { expression { currentBuild.currentResult == null || currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          def imageTag = "${env.BUILD_NUMBER}"
          def fullImage = "${DOCKER_IMAGE}:${imageTag}"

          withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS,
                                            usernameVariable: 'DOCKER_USER',
                                            passwordVariable: 'DOCKER_PASS')]) {
            bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
            bat "docker build -t ${fullImage} ."
            bat "docker push ${fullImage}"
            bat "docker logout"
          }

          // Guardamos el tag para siguientes stages
          env.IMAGE_TAG = imageTag
        }
      }
    }

    // --------- NUEVO: Actualizar manifests para GitOps ---------
    stage('Update K8s Manifests (GitOps)') {
      when { expression { env.IMAGE_TAG } }
      steps {
        script {
          def newImage = "${DOCKER_IMAGE}:${env.IMAGE_TAG}"

          // Cambiar la línea de image en deployment.yaml
          bat """
          powershell -Command "(Get-Content k8s/deployment.yaml) -replace 'image: .*', 'image: ${newImage}' | Set-Content k8s/deployment.yaml"
          """

          // Commit + push de los cambios
          withCredentials([usernamePassword(credentialsId: GITHUB_CREDENTIALS,
                                            usernameVariable: 'GIT_USER',
                                            passwordVariable: 'GIT_PASS')]) {
            bat 'git config user.email "jenkins@local"'
            bat 'git config user.name "Jenkins CI"'
            bat 'git status'
            bat 'git add k8s/deployment.yaml'
            bat "git commit -m \"Update image to ${newImage} [ci skip]\" || echo \"Nada que commitear\""
            // URL con token básico
            bat 'git push'
          }
        }
      }
    }

    // --------- OPCIONAL: Check estado en Argo CD ---------
    stage('Check ArgoCD App Status') {
      when { expression { env.IMAGE_TAG } }
      steps {
        script {
          // Requiere que tengas instalada la CLI 'argocd' en la máquina de Jenkins
          // y que hayas hecho 'argocd login' previamente (o uses --grpc-web, etc.)
          bat 'argocd app get nextjs-math-api'
        }
      }
    }
  }

  post {
    always {
      echo "Pipeline finalizado: ${currentBuild.currentResult}"
    }
    success {
      echo 'Notificando éxito por email (Gmail configurado en Jenkins).'
      emailext(
        to: env.EMAIL_TO ?: 'diegosebastia94@gmail.com',
        subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: "El build fue exitoso. Revisión: ${env.GIT_COMMIT}\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\nURL: ${env.BUILD_URL}"
      )
    }
    failure {
      echo 'Notificando fallo por email (Gmail configurado en Jenkins).'
      emailext(
        from: 'diegosebastia94@gmail.com',
        to: env.EMAIL_TO ?: 'diegosebastia94@gmail.com',
        subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: "El build falló. Revisión: ${env.GIT_COMMIT}\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\nURL: ${env.BUILD_URL}",
        attachLog: true
      )
    }
  }
}
