def bucket = 'sbcleardbuckettest'
def functionName = 'lambda-jenkins-test'
def region = 'us-east-2'

pipeline {
    agent any
    triggers {
        githubPush()
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Example Build') {
            steps {
                echo sh(returnStdout: true, script: 'env')
                sh "zip ${commitID()}.zip main"
            
            }
        }
        stage('Push') {
            steps {
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
