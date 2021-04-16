def bucket = 'sbcleardbuckettest'
def functionName = 'lambda-jenkins-test'
def region = 'us-east-2'


pipeline {

    agent {
        docker { 
            image 'node:12-alpine'
            args '-u root:root'
            }
    }

    environment {
        HOME = '.'
        GIT_COMMIT = "${env.GIT_COMMIT}"
        script{
            if( "${env.GIT_BRANCH}" == "origin/develop" ){
                echo "========= INSIDE BRANCH DEVELOP ======="
                MY_BRANCH = "my branch"
            }
        }
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo " ========${MY_BRANCH}======"

                echo "=========== NODE VERSION ========"
                sh 'node --version'
                sh 'cat /etc/*-release'
                sh "apk add --update sudo"
               
                sh "apk add zip"

                sh "apk add --no-cache python3 py3-pip"
                sh "pip3 install --upgrade pip"
                sh "pip3 install awscli"
            }
        }
        stage('Example Build') {
            steps {
                echo "========== ENV VARIABLES"
                sh 'env'  
                sh "npm install"
                sh "ls -l"
                sh "cp -R node_modules main/"
                //sh "apk add zip"
                sh "zip -r ${GIT_COMMIT}.zip main"
                echo "=======Zip file done====="
            
            }
        }

        stage('Push') {
            steps {
                    withAWS(credentials: 'aws-sbcleard-lambda', region: 'us-east-2') {
                        echo "=======Pushing to amazon S3====="
                        sh "aws s3 cp ${GIT_COMMIT}.zip s3://${bucket}/lambda/${GIT_COMMIT}.zip"
                    }
            }
        }

        stage('Deploy') {
            steps {
                withAWS(credentials: 'aws-sbcleard-lambda', region: 'us-east-2') {
                    sh "aws lambda update-function-code --function-name ${functionName} \
                    --s3-bucket ${bucket} \
                    --s3-key lambda/${GIT_COMMIT}.zip \
                    --region ${region}"
                }
            }
        }

    }

}


