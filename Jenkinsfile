def bucket = 'sbcleardbuckettest'
def functionName = 'lambda-jenkins-test'
def region = 'us-east-2'

pipeline {

    agent {
        docker { image 'node:12-alpine' }
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
                
                sh "npm install"
                sh "cp node_modules main/"
                sh "zip ${commitID()}.zip main"
                echo "=======Zip file done====="
            
            }
        }
        stage('Push') {
            steps {
                echo "=======Pushing to amazon S3====="
                sh "aws s3 cp ${commitID()}.zip s3://${bucket}"
            
            }
        }

        stage('Deploy') {
            steps {
                sh "aws lambda update-function-code --function-name ${functionName} \
                --s3-bucket ${bucket} \
                --s3-key ${commitID()}.zip \
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




