pipeline {
    agent any
    tools {
        nodejs "NodeJS" // This references the NodeJS installation we configured
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'ES6-Classes', 
                url: 'https://github.com/Poison-Iveey/JavaScript-Objects.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build Tailwind CSS') {
            steps {
                sh 'npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch'
            }
        }
        stage('Build Frontend') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy to Staging') {
            steps {
                // We'll implement deployment to Netlify/Vercel here
                sh 'echo "Deploying to staging..."'
            }
        }
    }
    post {
        always {
            cleanWs() // Clean workspace after build
        }
        success {
            emailext (
                subject: "SUCCESS: Library Project Build #${env.BUILD_NUMBER}",
                body: "The build ${env.BUILD_URL} completed successfully.",
                to: "${env.BUILD_USER_EMAIL}"
            )
        }
        failure {
            emailext (
                subject: "FAILED: Library Project Build #${env.BUILD_NUMBER}",
                body: "The build ${env.BUILD_URL} failed. Please check the console output.",
                to: "${env.BUILD_USER_EMAIL}"
            )
        }
    }
}
