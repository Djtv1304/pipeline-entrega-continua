pipeline {
  agent any

  tools { nodejs 'NodeJS_18' }

  options {
    ansiColor('xterm')
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps {
        echo 'Instalando dependencias (develop)...'
        script { isUnix() ? sh('npm ci') : bat('npm ci') }
      }
    }

    stage('Type Check') {
      steps {
        echo 'TypeScript check (develop)...'
        script { isUnix() ? sh('npm run typecheck') : bat('npm run typecheck') }
      }
    }

    stage('Unit Tests') {
      steps {
        echo 'Vitest (develop)...'
        script { isUnix() ? sh('npm test') : bat('npm test') }
      }
    }
  }

  post {
    always {
      echo "Pipeline develop finalizado: ${currentBuild.currentResult}"
    }
  }
}