#!/bin/bash

template=config/template.yaml
packaged=config/packaged-template.yaml

stack=$CLOUDFORMATION_STACK
region=$CLOUDFORMATION_REGION
bucket=$LAMBDA_BUCKET

AWS_ACCESS_KEY_ID=$(cat $AWS_ACCESS_KEY)
AWS_SECRET_ACCESS_KEY=$(cat $AWS_SECRET_KEY)

# workaround : timestamp error
find . -type f | xargs touch

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
