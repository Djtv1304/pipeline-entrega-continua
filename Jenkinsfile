pipeline {
  agent any

  tools { nodejs 'NodeJS_18' } // Define este nombre en Manage Jenkins → Tools (NodeJS)

  environment {
    EMAIL_TO = credentials('JENKINS_EMAIL_TO')
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
        script { isUnix() ? sh('npm run format:check') : bat('npm run format:check') }
      }
    }

    stage('Type Check') {
      steps {
        echo 'Chequeo de tipos con TypeScript...'
        script { isUnix() ? sh('npm run typecheck') : bat('npm run typecheck') }
      }
    }

    stage('Unit Tests') {
      steps {
        echo 'Ejecutando pruebas unitarias con Vitest...'
        script { isUnix() ? sh('npm test') : bat('npm test') }
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
        to: env.EMAIL_TO ?: 'tu-correo@gmail.com',
        subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: "El build fue exitoso. Revisión: ${env.GIT_COMMIT}\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\nURL: ${env.BUILD_URL}"
      )
    }
    failure {
      echo 'Notificando fallo por email (Gmail configurado en Jenkins).'
      emailext(
        to: env.EMAIL_TO ?: 'tu-correo@gmail.com',
        subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: "El build falló. Revisión: ${env.GIT_COMMIT}\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\nURL: ${env.BUILD_URL}",
        attachLog: true
      )
    }
  }
}