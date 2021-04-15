def bucket = 'sbcleardbuckettest'
def functionName = 'lambda-jenkins-test'
def region = 'us-east-2'

node('slaves'){
    stage('Checkout'){
        checkout scm
    }

    stage('Test'){
	echo sh(returnStdout: true, script: 'env')
    }

    stage('Build'){
	sh "cp node_modules main/"
        sh "zip ${commitID()}.zip main"
    }

    stage('Push'){
        sh "aws s3 cp ${commitID()}.zip s3://${bucket}"
    }

    stage('Deploy'){
        sh "aws lambda update-function-code --function-name ${functionName} \
                --s3-bucket ${bucket} \
                --s3-key ${commitID()}.zip \
                --region ${region}"
    }
}

def commitID() {
    sh 'git rev-parse HEAD > .git/commitID'
    def commitID = readFile('.git/commitID').trim()
    sh 'rm .git/commitID'
    commitID
}
