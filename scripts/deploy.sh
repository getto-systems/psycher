#!/bin/bash

template=config/template.yaml
packaged=config/packaged-template.yaml

stack=$CLOUDFORMATION_STACK
region=$CLOUDFORMATION_REGION
bucket=$LAMBDA_BUCKET

export HOME=$(pwd)

dump_aws_credentials(){
  echo "[default]"
  echo "aws_access_key_id = $(cat $AWS_ACCESS_KEY)"
  echo "aws_secret_access_key = $(cat $AWS_SECRET_KEY)"
}

mkdir -p .aws

dump_aws_credentials > .aws/credentials

aws cloudformation package \
  --template-file $template \
  --output-template-file $packaged \
  --s3-bucket $bucket \
  && \
aws cloudformation deploy \
  --template-file $packaged \
  --region $region \
  --stack-name $stack \
  && \
:
