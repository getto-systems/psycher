#!/bin/bash

template=template.yaml
packaged=packaged-template.yaml

stack=$CLOUDFORMATION_STACK
region=$CLOUDFORMATION_REGION
bucket=$LAMBDA_BUCKET

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
