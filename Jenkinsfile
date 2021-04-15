def bucket = 'sbcleardbuckettest'
def functionName = 'lambda-jenkins-test'
def region = 'us-east-2'

pipeline {

    agent {
        docker { image 'node:12-alpine' }
    }

    environment {
        HOME = '.'
        GIT_COMMIT = env.GIT_COMMIT
    }
    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "=========== NODE VERSION ========"
                sh 'node --version'
            }
        }
        stage('Example Build') {
            steps {
                echo "========== ENV VARIABLES"
                sh 'env'  
                sh "npm install"
                sh "ls -l"
                sh "cp -R node_modules main/"
                sh "zip ${GIT_COMMIT}.zip main"
                echo "=======Zip file done====="
            
            }
        }
        stage('Push') {
            steps {
                echo "=======Pushing to amazon S3====="
                sh "aws s3 cp ${GIT_COMMIT}.zip s3://${bucket}"
            
            }
        }

        stage('Deploy') {
            steps {
                sh "aws lambda update-function-code --function-name ${functionName} \
                --s3-bucket ${bucket} \
                --s3-key ${GIT_COMMIT}.zip \
                --region ${region}"
            
            }
        }

    }

}


def commitID() {
    sh 'git rev-parse HEAD > .git/commitID'
    def commitID = readFile('.git/commitID').trim()
    sh 'rm .git/commitID'
    commitID
}




