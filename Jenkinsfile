pipeline {
  agent any

  environment {
    // Configura este valor en el job de Jenkins o usa variables/credenciales
    EMAIL_TO = credentials('JENKINS_EMAIL_TO')
  }

  options {
    ansiColor('xterm')
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        echo 'Instalando dependencias con npm ci'
        sh 'npm ci'
      }
    }

    stage('Lint & Style') {
      steps {
        echo 'Ejecutando ESLint...'
        sh 'npm run lint'
        echo 'Verificando formato con Prettier...'
        sh 'npm run format:check'
      }
    }

    stage('Type Check') {
      steps {
        echo 'Chequeo de tipos con TypeScript...'
        sh 'npm run typecheck'
      }
    }

    stage('Unit Tests') {
      steps {
        echo 'Ejecutando pruebas unitarias con Vitest...'
        sh 'npm test'
      }
    }
  }

  post {
    always {
      echo "Pipeline finalizado: ${currentBuild.currentResult}"
    }

    success {
      script {
        echo 'Notificando éxito por email (Gmail configurado en Jenkins).'
      }
      emailext(
        to: env.EMAIL_TO ?: 'tu-correo@gmail.com',
        subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: "El build fue exitoso. Revisión: ${env.GIT_COMMIT}\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\nURL: ${env.BUILD_URL}"
      )
    }

    failure {
      script {
        echo 'Notificando fallo por email (Gmail configurado en Jenkins).'
      }
      emailext(
        to: env.EMAIL_TO ?: 'tu-correo@gmail.com',
        subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: "El build falló. Revisión: ${env.GIT_COMMIT}\nJob: ${env.JOB_NAME} #${env.BUILD_NUMBER}\nURL: ${env.BUILD_URL}",
        attachLog: true
      )
    }
  }
}

